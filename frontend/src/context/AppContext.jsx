import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  INITIAL_PLANTS, 
  INITIAL_EXPERIMENTS, 
  INITIAL_DEVICES, 
  INITIAL_ALERTS, 
  INITIAL_THRESHOLDS,
  PROJECT_METADATA,
  calculateScoresFromIndex,
  TREATMENT_KNOWLEDGE_BASE,
  AI_DISEASE_PRESETS,
  generateHistoricalReadings 
} from '../data/demoData';
import readingsService from '../api/readingsService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Core Entities State
  const [plants, setPlants] = useState(INITIAL_PLANTS);
  const [experiments, setExperiments] = useState(INITIAL_EXPERIMENTS);
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [thresholds, setThresholds] = useState(INITIAL_THRESHOLDS);
  const [readings, setReadings] = useState(() => generateHistoricalReadings());

  // System & API State
  const [demoMode, setDemoMode] = useState(true);
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    checking: true,
    dbStatus: 'unknown',
    isDbLive: false,
    message: '',
    lastChecked: null,
    latencyMs: null
  });

  // Active View Navigation State (12 Modules)
  const [activeTab, setActiveTab] = useState('overview');
  const [globalSearch, setGlobalSearch] = useState('');

  // AI Disease Screening History State
  const [screeningHistory, setScreeningHistory] = useState([
    {
      id: 'SCR001',
      plantId: 'PLANT001',
      plantSpecies: 'Solanum lycopersicum',
      predictedCondition: 'Healthy Leaf Canopy',
      pathogen: 'None (Physiologically Normal)',
      confidence: 0.96,
      isInconclusive: false,
      symptoms: 'Uniform deep green leaf lamina, crisp margins, robust turgor.',
      recommendedInspection: 'Maintain scheduled fertigation and optical sensing chamber checks.',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      associatedIndex: 0.64
    },
    {
      id: 'SCR002',
      plantId: 'PLANT002',
      plantSpecies: 'Solanum lycopersicum',
      predictedCondition: 'Water Deficit Stress / Early Chlorosis',
      pathogen: 'Abiotic Stress (Moisture Deprivation)',
      confidence: 0.88,
      isInconclusive: false,
      symptoms: 'Mild leaf curling and dulling of leaf reflectance.',
      recommendedInspection: 'Check soil moisture tension; cross-examine with optical sensor RED/NIR reflectance drop.',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      associatedIndex: 0.31
    }
  ]);

  // Live Monitoring State
  const [liveMonitoring, setLiveMonitoring] = useState({
    active: false,
    selectedPlantId: 'PLANT001',
    selectedExperimentId: 'EXP001',
    selectedDeviceId: 'ESP32-DEV-01',
    intervalSeconds: 3,
    chamberLightState: 'IDLE', // 'IDLE' | 'RED_660NM' | 'NIR_850NM'
    packetCount: 0,
    latestLiveReading: null,
    rawAdcCounts: { red: 4320, nir: 19580 }
  });

  // Stable Refs to prevent ticker restart loops
  const liveMonitoringRef = useRef(liveMonitoring);
  liveMonitoringRef.current = liveMonitoring;

  const plantsRef = useRef(plants);
  plantsRef.current = plants;

  const thresholdsRef = useRef(thresholds);
  thresholdsRef.current = thresholds;

  const isStepRunningRef = useRef(false);
  const liveTimerRef = useRef(null);

  // Check backend health periodically
  const checkBackend = useCallback(async () => {
    const startTime = performance.now();
    try {
      const res = await readingsService.checkHealth();
      const latency = Math.round(performance.now() - startTime);
      if (res.online && res.data) {
        setBackendStatus({
          online: true,
          checking: false,
          dbStatus: res.data.database?.status || 'connected',
          isDbLive: res.data.database?.isLive || false,
          message: res.data.message || 'Running',
          lastChecked: new Date().toLocaleTimeString(),
          latencyMs: latency
        });
      } else {
        setBackendStatus({
          online: false,
          checking: false,
          dbStatus: 'disconnected',
          isDbLive: false,
          message: 'Backend offline',
          lastChecked: new Date().toLocaleTimeString(),
          latencyMs: null
        });
      }
    } catch {
      setBackendStatus({
        online: false,
        checking: false,
        dbStatus: 'disconnected',
        isDbLive: false,
        message: 'Network unreachable',
        lastChecked: new Date().toLocaleTimeString(),
        latencyMs: null
      });
    }
  }, []);

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 20000);
    return () => clearInterval(interval);
  }, [checkBackend]);

  // Evaluate provisional plant health based on configurable thresholds
  const calculateProvisionalStatus = useCallback((index) => {
    if (typeof index !== 'number' || isNaN(index)) return 'Unknown';
    const th = thresholdsRef.current;
    if (index >= th.optimal) return 'Healthy';
    if (index >= th.moderateStress) return 'Moderate Stress';
    return 'Severe Stress';
  }, []);

  // Submit reading to backend (and update local state)
  const submitReading = useCallback(async (readingInput) => {
    const { 
      plantId, 
      experimentId, 
      deviceId, 
      redReflectance, 
      nirReflectance, 
      index: providedIndex,
      rawRedAdc,
      rawNirAdc,
      source = 'simulated' 
    } = readingInput;

    const denominator = nirReflectance + redReflectance;
    if (denominator === 0) {
      throw new Error('Reflectance values cannot both be zero.');
    }

    // Index calculation: (NIR - RED) / (NIR + RED)
    const computedIndex = typeof providedIndex === 'number' 
      ? parseFloat(providedIndex.toFixed(4))
      : parseFloat(((nirReflectance - redReflectance) / denominator).toFixed(4));

    const { healthScore, stressScore } = calculateScoresFromIndex(computedIndex);
    let savedRecord = null;

    try {
      const apiResponse = await readingsService.submitReading({
        plantId,
        experimentId,
        deviceId,
        redReflectance,
        nirReflectance,
        index: computedIndex,
        rawRedAdc,
        rawNirAdc,
        source
      });

      if (apiResponse && apiResponse.success && apiResponse.data) {
        savedRecord = apiResponse.data;
      }
    } catch (apiErr) {
      console.warn('[AppContext] Backend POST fallback to client state:', apiErr.message);
    }

    if (!savedRecord) {
      savedRecord = {
        _id: 'client_' + Date.now(),
        plantId,
        experimentId,
        deviceId,
        redReflectance: parseFloat(redReflectance.toFixed(4)),
        nirReflectance: parseFloat(nirReflectance.toFixed(4)),
        index: computedIndex,
        plantHealthScore: healthScore,
        plantStressScore: stressScore,
        rawRedAdc: rawRedAdc || Math.round(128 + redReflectance * 28000),
        rawNirAdc: rawNirAdc || Math.round(128 + nirReflectance * 28000),
        source,
        createdAt: new Date().toISOString()
      };
    }

    setReadings(prev => [savedRecord, ...prev.slice(0, 199)]);

    setPlants(prev => prev.map(p => {
      if (p.id === plantId) {
        const newStatus = calculateProvisionalStatus(computedIndex);
        return {
          ...p,
          provisionalIndex: computedIndex,
          healthScore,
          stressScore,
          redReflectance: parseFloat(redReflectance.toFixed(4)),
          nirReflectance: parseFloat(nirReflectance.toFixed(4)),
          status: newStatus,
          lastReadingAt: new Date().toISOString()
        };
      }
      return p;
    }));

    if (computedIndex < thresholdsRef.current.severeStress) {
      const targetPlant = plantsRef.current.find(p => p.id === plantId);
      const plantLabel = targetPlant ? targetPlant.name : plantId;
      const newAlert = {
        id: `ALT_${Date.now()}`,
        severity: 'Critical',
        type: 'threshold_breach',
        plantId,
        plantName: plantLabel,
        deviceId,
        timestamp: new Date().toISOString(),
        description: `Provisional optical index fell to ${computedIndex} (Health Score: ${healthScore}/100, below limit ${thresholdsRef.current.severeStress}).`,
        isResolved: false,
        calibrationNote: 'Provisional alert threshold; verify with lab measurement.'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }

    return savedRecord;
  }, [calculateProvisionalStatus]);

  // Robust Live Simulation Ticker
  const runSimulationTick = useCallback(async () => {
    if (isStepRunningRef.current) return;
    isStepRunningRef.current = true;

    const { selectedPlantId, selectedExperimentId, selectedDeviceId } = liveMonitoringRef.current;

    // Phase 1: Sequential RED LED (660nm) illumination pulse
    setLiveMonitoring(prev => ({ ...prev, chamberLightState: 'RED_660NM' }));

    setTimeout(() => {
      // Phase 2: Sequential NIR LED (850nm) illumination pulse
      setLiveMonitoring(prev => ({ ...prev, chamberLightState: 'NIR_850NM' }));

      setTimeout(async () => {
        try {
          const currentPlants = plantsRef.current;
          const targetPlant = currentPlants.find(p => p.id === selectedPlantId);

          const baseRed = targetPlant ? targetPlant.redReflectance : 0.18;
          const baseNir = targetPlant ? targetPlant.nirReflectance : 0.68;

          // Micro-variations simulating leaf surface reflectance
          const deltaRed = (Math.random() - 0.5) * 0.02;
          const deltaNir = (Math.random() - 0.5) * 0.025;

          const simRed = Math.max(0.05, Math.min(0.95, parseFloat((baseRed + deltaRed).toFixed(4))));
          const simNir = Math.max(0.05, Math.min(0.95, parseFloat((baseNir + deltaNir).toFixed(4))));

          // 16-bit ADS1115 ADC counts from BPW34 photodiode
          const rawRed = Math.round(128 + simRed * 28000);
          const rawNir = Math.round(128 + simNir * 28000);

          // ESP32 on-device primary index calculation
          const esp32Index = parseFloat(((simNir - simRed) / (simNir + simRed)).toFixed(4));

          const newReading = await submitReading({
            plantId: selectedPlantId,
            experimentId: selectedExperimentId,
            deviceId: selectedDeviceId,
            redReflectance: simRed,
            nirReflectance: simNir,
            index: esp32Index,
            rawRedAdc: rawRed,
            rawNirAdc: rawNir,
            source: 'simulated'
          });

          setLiveMonitoring(prev => ({
            ...prev,
            chamberLightState: 'IDLE',
            packetCount: prev.packetCount + 1,
            latestLiveReading: newReading,
            rawAdcCounts: { red: rawRed, nir: rawNir }
          }));
        } catch (err) {
          console.error('[Live Simulation Tick Error]', err);
          setLiveMonitoring(prev => ({ ...prev, chamberLightState: 'IDLE' }));
        } finally {
          isStepRunningRef.current = false;
        }
      }, 450);
    }, 450);
  }, [submitReading]);

  // Start / Stop Live Simulation Handler
  const toggleLiveMonitoring = useCallback(() => {
    setLiveMonitoring(prev => {
      const nextActive = !prev.active;
      return { ...prev, active: nextActive };
    });
  }, []);

  // Timer Effect that only reacts to active state or interval change
  useEffect(() => {
    if (liveMonitoring.active) {
      // Run first step immediately
      runSimulationTick();
      const intervalMs = Math.max(2, liveMonitoring.intervalSeconds) * 1000;
      liveTimerRef.current = setInterval(runSimulationTick, intervalMs);
    } else {
      if (liveTimerRef.current) {
        clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
      isStepRunningRef.current = false;
      setLiveMonitoring(prev => ({ ...prev, chamberLightState: 'IDLE' }));
    }

    return () => {
      if (liveTimerRef.current) {
        clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
    };
  }, [liveMonitoring.active, liveMonitoring.intervalSeconds, runSimulationTick]);

  // Plant CRUD
  const addPlant = useCallback((newPlantData) => {
    const id = `PLANT00${plants.length + 1}`;
    const pIndex = newPlantData.provisionalIndex !== undefined ? newPlantData.provisionalIndex : 0.55;
    const { healthScore, stressScore } = calculateScoresFromIndex(pIndex);

    const plant = {
      id,
      ...newPlantData,
      status: calculateProvisionalStatus(pIndex),
      provisionalIndex: pIndex,
      healthScore,
      stressScore,
      group: newPlantData.group || 'Normal Control',
      redReflectance: newPlantData.redReflectance || 0.18,
      nirReflectance: newPlantData.nirReflectance || 0.68,
      lastReadingAt: new Date().toISOString()
    };
    setPlants(prev => [plant, ...prev]);
    return plant;
  }, [calculateProvisionalStatus, plants.length]);

  const updatePlant = useCallback((id, updatedFields) => {
    setPlants(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updatedFields };
        if (updatedFields.provisionalIndex !== undefined) {
          merged.status = calculateProvisionalStatus(updatedFields.provisionalIndex);
          const scores = calculateScoresFromIndex(updatedFields.provisionalIndex);
          merged.healthScore = scores.healthScore;
          merged.stressScore = scores.stressScore;
        }
        return merged;
      }
      return p;
    }));
  }, [calculateProvisionalStatus]);

  const deletePlant = useCallback((id) => {
    setPlants(prev => prev.filter(p => p.id !== id));
    setReadings(prev => prev.filter(r => r.plantId !== id));
  }, []);

  // Experiment CRUD
  const addExperiment = useCallback((expData) => {
    const id = `EXP00${experiments.length + 1}`;
    const exp = { id, ...expData };
    setExperiments(prev => [exp, ...prev]);
    return exp;
  }, [experiments.length]);

  const updateExperiment = useCallback((id, updatedFields) => {
    setExperiments(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  }, []);

  const deleteExperiment = useCallback((id) => {
    setExperiments(prev => prev.filter(e => e.id !== id));
  }, []);

  // Device CRUD
  const addDevice = useCallback((deviceData) => {
    const id = `ESP32-DEV-0${devices.length + 1}`;
    const device = {
      id,
      ...deviceData,
      lastPing: new Date().toISOString(),
      signalStrengthDbm: -60,
      batteryVoltageV: 3.90,
      batteryLevelPct: 80,
      displayType: '1.8" TFT (ST7735)'
    };
    setDevices(prev => [device, ...prev]);
    return device;
  }, [devices.length]);

  const updateDevice = useCallback((id, updatedFields) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updatedFields } : d));
  }, []);

  const deleteDevice = useCallback((id) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  }, []);

  // Alert Actions
  const resolveAlert = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isResolved: true } : a));
  }, []);

  const clearResolvedAlerts = useCallback(() => {
    setAlerts(prev => prev.filter(a => !a.isResolved));
  }, []);

  // Update Thresholds
  const updateThresholds = useCallback((newThresholds) => {
    setThresholds(newThresholds);
    setPlants(prev => prev.map(p => {
      let st = 'Healthy';
      if (p.provisionalIndex < newThresholds.severeStress) st = 'Severe Stress';
      else if (p.provisionalIndex < newThresholds.optimal) st = 'Moderate Stress';
      return { ...p, status: st };
    }));
  }, []);

  // AI Disease Screening Action
  const runAiScreening = useCallback((plantId, species, imageFile, presetOption) => {
    const selectedPreset = presetOption || AI_DISEASE_PRESETS[0];
    const targetPlant = plantsRef.current.find(p => p.id === plantId);

    const screeningRecord = {
      id: `SCR_${Date.now()}`,
      plantId: plantId || 'PLANT001',
      plantSpecies: species || targetPlant?.species || 'Solanum lycopersicum',
      predictedCondition: selectedPreset.predictedCondition,
      pathogen: selectedPreset.pathogen,
      confidence: selectedPreset.confidence,
      isInconclusive: selectedPreset.isInconclusive,
      symptoms: selectedPreset.symptoms,
      recommendedInspection: selectedPreset.recommendedInspection,
      timestamp: new Date().toISOString(),
      associatedIndex: targetPlant?.provisionalIndex || 0.55
    };

    setScreeningHistory(prev => [screeningRecord, ...prev]);
    return screeningRecord;
  }, []);

  const value = {
    projectMetadata: PROJECT_METADATA,
    plants,
    experiments,
    devices,
    alerts,
    thresholds,
    readings,
    demoMode,
    setDemoMode,
    backendStatus,
    checkBackend,
    activeTab,
    setActiveTab,
    globalSearch,
    setGlobalSearch,
    screeningHistory,
    runAiScreening,
    treatmentKnowledgeBase: TREATMENT_KNOWLEDGE_BASE,
    liveMonitoring,
    setLiveMonitoring,
    toggleLiveMonitoring,
    triggerSimulationStep: runSimulationTick,
    submitReading,
    calculateProvisionalStatus,
    calculateScoresFromIndex,
    addPlant,
    updatePlant,
    deletePlant,
    addExperiment,
    updateExperiment,
    deleteExperiment,
    addDevice,
    updateDevice,
    deleteDevice,
    resolveAlert,
    clearResolvedAlerts,
    updateThresholds
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
