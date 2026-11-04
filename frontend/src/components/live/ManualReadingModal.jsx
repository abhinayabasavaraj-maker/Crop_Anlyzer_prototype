import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { calculateScoresFromIndex } from '../../data/demoData';

const ManualReadingModal = ({ isOpen, onClose }) => {
  const { plants, experiments, devices, submitReading } = useApp();

  const [plantId, setPlantId] = useState(plants[0]?.id || 'PLANT001');
  const [experimentId, setExperimentId] = useState(experiments[0]?.id || 'EXP001');
  const [deviceId, setDeviceId] = useState(devices[0]?.id || 'ESP32-DEV-01');
  const [redReflectance, setRedReflectance] = useState('0.18');
  const [nirReflectance, setNirReflectance] = useState('0.72');
  const [source, setSource] = useState('simulated');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Pre-calculate preview index and scores
  const numRed = parseFloat(redReflectance);
  const numNir = parseFloat(nirReflectance);
  const denom = numRed + numNir;
  const computedIndex = !isNaN(numRed) && !isNaN(numNir) && denom > 0 
    ? parseFloat(((numNir - numRed) / denom).toFixed(4))
    : null;

  const { healthScore, stressScore } = computedIndex !== null
    ? calculateScoresFromIndex(computedIndex)
    : { healthScore: 0, stressScore: 0 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (isNaN(numRed) || isNaN(numNir)) {
      setError('Please enter valid numeric reflectance values.');
      return;
    }
    if (numRed < 0 || numRed > 1 || numNir < 0 || numNir > 1) {
      setError('Calibrated reflectance values must be normalized between 0.00 and 1.00.');
      return;
    }
    if (numRed === 0 && numNir === 0) {
      setError('Both reflectance values cannot be zero. Index calculation requires non-zero denominator.');
      return;
    }

    setLoading(true);
    try {
      const response = await submitReading({
        plantId,
        experimentId,
        deviceId,
        redReflectance: numRed,
        nirReflectance: numNir,
        index: computedIndex,
        rawRedAdc: Math.round(128 + numRed * 28000),
        rawNirAdc: Math.round(128 + numNir * 28000),
        source
      });

      setResult({
        success: true,
        data: response,
        message: 'Sensor reading successfully saved to Express backend!'
      });
    } catch (err) {
      setError(err.message || 'Failed to submit sensor reading');
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (type) => {
    if (type === 'healthy') {
      setRedReflectance('0.15');
      setNirReflectance('0.75');
    } else if (type === 'water_stressed') {
      setRedReflectance('0.34');
      setNirReflectance('0.58');
    } else if (type === 'severe_chlorosis') {
      setRedReflectance('0.46');
      setNirReflectance('0.48');
    } else if (type === 'non_vegetative') {
      setRedReflectance('0.60');
      setNirReflectance('0.40'); // Negative index
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manual Optical Sensor Reading Trigger (ESP32 Gateway)" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1.5">Load Physiological Preset:</label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setPreset('healthy')}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              Normal Healthy (+0.67)
            </button>
            <button
              type="button"
              onClick={() => setPreset('water_stressed')}
              className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              Water-Stressed (+0.26)
            </button>
            <button
              type="button"
              onClick={() => setPreset('severe_chlorosis')}
              className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-800 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              Severe Chlorosis (+0.02)
            </button>
            <button
              type="button"
              onClick={() => setPreset('non_vegetative')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-800 rounded-lg border border-slate-300 hover:bg-slate-200 transition-colors"
            >
              Dry Leaf / Soil (-0.20)
            </button>
          </div>
        </div>

        {/* Plant, Experiment & Device dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target Specimen</label>
            <select
              value={plantId}
              onChange={(e) => setPlantId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {plants.map(p => (
                <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Experiment Cohort</label>
            <select
              value={experimentId}
              onChange={(e) => setExperimentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {experiments.map(e => (
                <option key={e.id} value={e.id}>{e.id} - {e.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">ESP32 Hardware</label>
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {devices.map(d => (
                <option key={d.id} value={d.id}>{d.id} - {d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reflectance Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              RED Reflectance (~660 nm)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={redReflectance}
              onChange={(e) => setRedReflectance(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="0.00 to 1.00"
              required
            />
            <span className="text-[10px] text-slate-400 font-mono">Sim. ADC: ~{Math.round(128 + (numRed || 0) * 28000)} counts</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              NIR Reflectance (~850 nm)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={nirReflectance}
              onChange={(e) => setNirReflectance(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="0.00 to 1.00"
              required
            />
            <span className="text-[10px] text-slate-400 font-mono">Sim. ADC: ~{Math.round(128 + (numNir || 0) * 28000)} counts</span>
          </div>
        </div>

        {/* Telemetry Origin */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Telemetry Origin / Source:</label>
          <div className="flex gap-4 text-xs font-medium">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                name="source" 
                value="simulated" 
                checked={source === 'simulated'} 
                onChange={(e) => setSource(e.target.value)} 
              />
              <span>Simulated Prototype Data</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                name="source" 
                value="esp32" 
                checked={source === 'esp32'} 
                onChange={(e) => setSource(e.target.value)} 
              />
              <span>ESP32 Physical Hardware</span>
            </label>
          </div>
        </div>

        {/* Calculated Formula Preview Box */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs font-mono space-y-1">
          <div className="flex justify-between items-center text-emerald-950 font-semibold">
            <span>NDVI-Like Index:</span>
            <span className="text-base font-bold text-emerald-700">{computedIndex !== null ? computedIndex : 'Undefined'}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-900 text-[11px]">
            <span>Derived Health Score: <strong>{healthScore}/100</strong></span>
            <span>Stress Score: <strong>{stressScore}/100</strong></span>
          </div>
          <p className="text-[10px] text-emerald-800 font-sans pt-1 border-t border-emerald-200/60">
            Formula: ({nirReflectance} - {redReflectance}) / ({nirReflectance} + {redReflectance}) = {computedIndex}
          </p>
        </div>

        {/* Feedback Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-semibold">{result.message}</p>
              <p className="text-[10px] font-mono mt-0.5 text-emerald-700">
                Index: {result.data.index} • Health: {result.data.plantHealthScore}/100 • ID: {result.data._id}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Send to POST /api/readings</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default ManualReadingModal;
