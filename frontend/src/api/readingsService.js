import apiClient from './client';

/**
 * Service for communicating with Crop Analyser Express backend API.
 */
export const readingsService = {
  /**
   * Health check to detect backend online status and database state
   */
  async checkHealth() {
    try {
      const res = await apiClient.get('/health');
      return {
        online: true,
        data: res.data,
      };
    } catch (err) {
      return {
        online: false,
        error: err.message,
      };
    }
  },

  /**
   * Submit new sensor reading to POST /api/readings
   * Validates contract: plantId, experimentId, deviceId, redReflectance, nirReflectance, source
   */
  async submitReading(readingData) {
    const { plantId, experimentId, deviceId, redReflectance, nirReflectance, source = 'simulated' } = readingData;

    // Frontend pre-flight validation matching scientific constraints
    if (typeof redReflectance !== 'number' || typeof nirReflectance !== 'number') {
      throw new Error('Reflectance values must be numeric numbers between 0.0 and 1.0');
    }
    if (redReflectance < 0 || redReflectance > 1 || nirReflectance < 0 || nirReflectance > 1) {
      throw new Error('Calibrated reflectance values must be bounded between 0.0 and 1.0');
    }
    if (redReflectance + nirReflectance === 0) {
      throw new Error('Both reflectance values cannot be zero (division by zero undefined)');
    }

    const payload = {
      plantId: plantId.trim(),
      experimentId: experimentId.trim(),
      deviceId: deviceId.trim(),
      redReflectance: parseFloat(redReflectance.toFixed(4)),
      nirReflectance: parseFloat(nirReflectance.toFixed(4)),
      source: source || 'simulated',
    };

    const res = await apiClient.post('/readings', payload);
    return res.data;
  },

  /**
   * Retrieve readings from GET /api/readings (if backend route available)
   */
  async getReadings(params = {}) {
    try {
      const res = await apiClient.get('/readings', { params });
      return res.data;
    } catch (err) {
      console.warn('[readingsService.getReadings] Failed to query backend:', err.message);
      return null;
    }
  },

  /**
   * Retrieve latest reading from GET /api/readings/latest
   */
  async getLatestReading(plantId) {
    try {
      const res = await apiClient.get('/readings/latest', { params: { plantId } });
      return res.data;
    } catch (err) {
      console.warn('[readingsService.getLatestReading] Failed to query backend:', err.message);
      return null;
    }
  }
};

export default readingsService;
