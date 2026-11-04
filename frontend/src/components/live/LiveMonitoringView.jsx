import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Square, 
  Activity, 
  Radio, 
  Cpu, 
  Clock, 
  Sparkles,
  Send,
  HeartPulse,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ChamberVisualizer from './ChamberVisualizer';
import ManualReadingModal from './ManualReadingModal';
import ThresholdBadge from '../common/ThresholdBadge';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

const LiveMonitoringView = () => {
  const { 
    plants, 
    experiments, 
    devices, 
    readings, 
    liveMonitoring, 
    setLiveMonitoring, 
    toggleLiveMonitoring
  } = useApp();

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const { 
    active, 
    selectedPlantId, 
    selectedExperimentId, 
    selectedDeviceId, 
    intervalSeconds,
    packetCount,
    rawAdcCounts,
    latestLiveReading
  } = liveMonitoring;

  const currentPlant = plants.find(p => p.id === selectedPlantId) || plants[0];
  const currentDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const currentExperiment = experiments.find(e => e.id === selectedExperimentId) || experiments[0];

  const plantLiveReadings = useMemo(() => {
    return readings
      .filter(r => r.plantId === selectedPlantId)
      .slice(0, 15)
      .reverse();
  }, [readings, selectedPlantId]);

  const activeReading = (latestLiveReading && latestLiveReading.plantId === selectedPlantId)
    ? latestLiveReading
    : (readings.find(r => r.plantId === selectedPlantId) || readings[0]);

  const liveChartData = plantLiveReadings.map(r => ({
    time: new Date(r.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    red: r.redReflectance,
    nir: r.nirReflectance,
    index: r.index,
    healthScore: r.plantHealthScore || 70,
    source: r.source
  }));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Simulation Banner Notice */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>SIMULATED SENSOR DATA MODE:</strong> Generating simulated BPW34 photodiode signals & ADS1115 (16-bit ADC) counts for physical ESP32 chamber emulation. Ready for real HTTP Wi-Fi payloads via <code className="bg-amber-100 font-mono px-1 py-0.5 rounded text-amber-950 font-bold">POST /api/readings</code>.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded shrink-0">
          Simulated Packets: {packetCount}
        </span>
      </div>

      {/* Control Station Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1">
            
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Monitored Specimen
              </label>
              <select
                value={selectedPlantId}
                onChange={(e) => setLiveMonitoring(prev => ({ ...prev, selectedPlantId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {plants.map(p => (
                  <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Experiment Cohort
              </label>
              <select
                value={selectedExperimentId}
                onChange={(e) => setLiveMonitoring(prev => ({ ...prev, selectedExperimentId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {experiments.map(e => (
                  <option key={e.id} value={e.id}>{e.id} — {e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Hardware Node
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => setLiveMonitoring(prev => ({ ...prev, selectedDeviceId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>{d.id} ({d.name})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Sampling Cadence
              </label>
              <select
                value={intervalSeconds}
                onChange={(e) => setLiveMonitoring(prev => ({ ...prev, intervalSeconds: Number(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value={2}>2s (High Cadence)</option>
                <option value={3}>3s (Standard Scan)</option>
                <option value={5}>5s (Power Saving)</option>
                <option value={10}>10s</option>
              </select>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <button
              onClick={toggleLiveMonitoring}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                active 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
              }`}
            >
              {active ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Monitoring</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Monitoring</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Test custom RED/NIR values and POST to /api/readings"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Manual Test</span>
            </button>
          </div>

        </div>
      </div>

      {/* Real-time Telemetry KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* RED Reflectance */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[9px]">RED Reflectance</span>
            <span className="font-mono text-red-600 font-bold bg-red-50 px-1 py-0.2 rounded text-[10px]">660 nm</span>
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-slate-900">
            {activeReading ? activeReading.redReflectance : '0.00'}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            ADC: ~{rawAdcCounts.red}
          </p>
        </div>

        {/* NIR Reflectance */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[9px]">NIR Reflectance</span>
            <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-1 py-0.2 rounded text-[10px]">850 nm</span>
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-slate-900">
            {activeReading ? activeReading.nirReflectance : '0.00'}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            ADC: ~{rawAdcCounts.nir}
          </p>
        </div>

        {/* Calculated Index (-1 to +1) */}
        <div className="bg-white rounded-xl border border-emerald-200 p-3.5 shadow-sm bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[9px] text-emerald-800">Index [-1, +1]</span>
            <span className="font-mono text-[9px] text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">ESP32</span>
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-emerald-700 flex items-center justify-between">
            <span>{activeReading ? activeReading.index : '0.00'}</span>
          </div>
          <p className="text-[9px] font-mono text-slate-400">
            (NIR-RED)/(NIR+RED)
          </p>
        </div>

        {/* Plant Health Score */}
        <div className="bg-white rounded-xl border border-emerald-200 p-3.5 shadow-sm bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[9px] text-emerald-800">Health Score</span>
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-emerald-700">
            {activeReading?.plantHealthScore !== undefined ? activeReading.plantHealthScore : 75}
            <span className="text-xs font-normal text-emerald-600">/100</span>
          </div>
          <p className="text-[10px] text-slate-500">
            {currentPlant?.status || 'Healthy'}
          </p>
        </div>

        {/* Plant Stress Score */}
        <div className="bg-white rounded-xl border border-rose-200 p-3.5 shadow-sm bg-gradient-to-br from-white to-rose-50/20">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[9px] text-rose-800">Stress Score</span>
            <span className="font-mono text-[9px] text-rose-700 font-bold">Severity</span>
          </div>
          <div className="mt-1 text-xl font-bold font-mono text-rose-700">
            {activeReading?.plantStressScore !== undefined ? activeReading.plantStressScore : 25}
            <span className="text-xs font-normal text-rose-600">/100</span>
          </div>
          <p className="text-[10px] text-slate-500">
            {(activeReading?.plantStressScore || 25) > 60 ? 'High Deficit' : 'Tolerable'}
          </p>
        </div>

        {/* Device Status & Ping */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[9px]">Hardware Node</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
              currentDevice.status === 'Online' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {currentDevice.status}
            </span>
          </div>
          <div className="mt-1 text-xs font-bold font-mono text-slate-800 truncate">
            {currentDevice.id}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {activeReading ? new Date(activeReading.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ready'}
          </div>
        </div>

      </div>

      {/* Chamber Visualizer & 1.8" TFT Screen Emulator */}
      <ChamberVisualizer />

      {/* Real-time Streaming Line Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Optical Reflectance Stream</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates as photodetector measures alternating 660nm and 850nm pulses
            </p>
          </div>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            Specimen: {currentPlant.name}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={liveChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={[-0.2, 1.0]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1 font-mono">
                        <p className="text-slate-400 font-sans font-semibold mb-1">{label}</p>
                        <p className="text-rose-400">RED 660nm: {payload[0]?.value}</p>
                        <p className="text-indigo-400">NIR 850nm: {payload[1]?.value}</p>
                        <p className="text-emerald-400 font-bold border-t border-slate-800 pt-1">
                          Index: {payload[2]?.value}
                        </p>
                        <p className="text-emerald-300">Health Score: {payload[3]?.value}/100</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="red" name="RED (660nm)" stroke="#e11d48" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="nir" name="NIR (850nm)" stroke="#4f46e5" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="index" name="Calculated Index (-1 to +1)" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="healthScore" name="Health Score (/100)" stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Packet Stream Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Sensor Packet Stream</h3>
          <span className="text-[11px] font-mono text-slate-400">Showing last 8 logged readings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Packet Timestamp</th>
                <th className="py-2.5 px-3">Plant ID</th>
                <th className="py-2.5 px-3 font-mono">RED (660nm)</th>
                <th className="py-2.5 px-3 font-mono">NIR (850nm)</th>
                <th className="py-2.5 px-3 font-mono">Index [-1, +1]</th>
                <th className="py-2.5 px-3 font-mono">Health Score</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {readings.slice(0, 8).map(r => (
                <tr key={r._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500">
                    {new Date(r.createdAt || Date.now()).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{r.plantId}</td>
                  <td className="py-2.5 px-3 font-mono text-rose-600 font-bold">{r.redReflectance}</td>
                  <td className="py-2.5 px-3 font-mono text-indigo-600 font-bold">{r.nirReflectance}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">{r.index}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600 font-bold">
                    {r.plantHealthScore !== undefined ? `${r.plantHealthScore}/100` : '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    <ThresholdBadge indexValue={r.index} status={r.index >= 0.45 ? 'Healthy' : r.index >= 0.20 ? 'Moderate Stress' : 'Severe Stress'} />
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {r.source || 'simulated'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Reading Modal */}
      <ManualReadingModal 
        isOpen={isManualModalOpen} 
        onClose={() => setIsManualModalOpen(false)} 
      />

    </div>
  );
};

export default LiveMonitoringView;
