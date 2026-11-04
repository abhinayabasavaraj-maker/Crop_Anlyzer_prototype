import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for response handling and logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log helpful diagnostic info without crashing
    if (error.response) {
      console.warn(`[Crop Analyser API Error] ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.warn('[Crop Analyser API Error] No response from backend server. Falling back to local simulation mode.');
    } else {
      console.warn('[Crop Analyser API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
