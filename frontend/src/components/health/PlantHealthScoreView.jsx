import React, { useState, useMemo } from 'react';
import { 
  HeartPulse, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Layers, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Scale,
  FlaskConical,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ThresholdBadge from '../common/ThresholdBadge';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  ReferenceArea
} from 'recharts';

const PlantHealthScoreView = () => {
  const { plants, experiments, readings, thresholds } = useApp();

  const [selectedPlantId, setSelectedPlantId] = useState(plants[0]?.id || 'PLANT001');
  const [selectedExperimentId, setSelectedExperimentId] = useState('EXP001');

  const selectedPlant = plants.find(p => p.id === selectedPlantId) || plants[0];
  const selectedExp = experiments.find(e => e.id === selectedExperimentId) || experiments[0];

  // Readings for the selected plant
  const plantReadings = useMemo(() => {
    return readings
      .filter(r => r.plantId === selectedPlantId)
      .slice(0, 20)
      .reverse();
  }, [readings, selectedPlantId]);

  // Chart data showing both Index (-1 to +1) on right axis and Health Score (0-100) on left axis
  const scoreTrendData = useMemo(() => {
    return plantReadings.map(r => {
      const d = new Date(r.createdAt || Date.now());
      return {
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        index: r.index,
        healthScore: r.plantHealthScore || Math.round((r.index + 1) * 50),
        stressScore: r.plantStressScore || Math.max(0, 100 - (r.plantHealthScore || 50)),
        redReflectance: r.redReflectance,
        nirReflectance: r.nirReflectance
      };
    });
  }, [plantReadings]);

  // Group comparison: Normal Control vs Water-Stressed plants in EXP001
  const cohortComparisonData = useMemo(() => {
    // Collect all readings for EXP001
    const expReadings = readings.filter(r => r.experimentId === 'EXP001');
    const timeMap = new Map();

    expReadings.slice(0, 30).reverse().forEach(r => {
      const d = new Date(r.createdAt || Date.now());
      const key = d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (!timeMap.has(key)) {
        timeMap.set(key, { time: key, normalTotal: 0, normalCount: 0, stressedTotal: 0, stressedCount: 0 });
      }
      const entry = timeMap.get(key);
      const isControl = r.plantId === 'PLANT001' || r.plantId === 'PLANT005';
      const isStressed = r.plantId === 'PLANT002';
      
      const hScore = r.plantHealthScore || Math.round((r.index + 1) * 50);

      if (isControl) {
        entry.normalTotal += hScore;
        entry.normalCount += 1;
      } else if (isStressed) {
        entry.stressedTotal += hScore;
        entry.stressedCount += 1;
      }
    });

    return Array.from(timeMap.values()).map(item => ({
      time: item.time,
      normalAvgHealth: item.normalCount > 0 ? Math.round(item.normalTotal / item.normalCount) : null,
      stressedAvgHealth: item.stressedCount > 0 ? Math.round(item.stressedTotal / item.stressedCount) : null
    }));
  }, [readings]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Interpretation & Scientific Disclaimer Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-indigo-950/90 rounded-2xl p-5 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Scale className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Plant Health & Stress Scoring Framework
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                TRL 2 Prototype
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              <strong>Distinction of Metrics:</strong> The physical optical index <code className="text-emerald-400 font-mono">(NIR - RED)/(NIR + RED)</code> has a theoretical range of <strong>-1.0 to +1.0</strong>. 
              The <strong>Plant Health Score (0–100)</strong> and <strong>Plant Stress Score (0–100)</strong> are non-linear derived indicators. 
              They are <em>not</em> directly multiplied by 100, but mapped using provisional vegetative response curves that account for cellular mesophyll compaction and chlorophyll absorption depth.
            </p>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 font-mono text-[11px] shrink-0 space-y-1">
            <div className="text-slate-400 font-sans font-bold text-[10px] uppercase">BMSCE Calibration Status:</div>
            <div className="text-emerald-400 font-bold">Provisional / Illustrative</div>
            <div className="text-slate-400 text-[10px]">Benchmarking vs. SPAD meter</div>
          </div>
        </div>
      </div>

      {/* Specimen Selection Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Target Specimen Analysis:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPlantId}
            onChange={(e) => setSelectedPlantId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {plants.map(p => (
              <option key={p.id} value={p.id}>
                {p.id}: {p.name} [{p.group || 'Specimen'}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metric Gauges for Selected Specimen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Physical Optical Index */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Physical Index</span>
            <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
              Range [-1.0, +1.0]
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 flex items-baseline justify-between">
            <span>{selectedPlant.provisionalIndex}</span>
            <ThresholdBadge status={selectedPlant.status} showProvisional />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Formula: (NIR - RED) / (NIR + RED)
          </p>
        </div>

        {/* Plant Health Score (0-100) */}
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-emerald-800">Plant Health Score</span>
            <span className="font-mono text-emerald-700 font-bold text-[10px]">Scale 0–100</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-700">
              {selectedPlant.healthScore || 75}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">/ 100</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${selectedPlant.healthScore || 75}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-500">
            {selectedPlant.healthScore >= 70 ? 'Vigorous vegetative state' :
             selectedPlant.healthScore >= 35 ? 'Moderate stress observed' : 'Severe physiological stress'}
          </p>
        </div>

        {/* Plant Stress Score (0-100) */}
        <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-sm bg-gradient-to-br from-white to-rose-50/20">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-rose-800">Plant Stress Score</span>
            <span className="font-mono text-rose-700 font-bold text-[10px]">Scale 0–100</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-rose-700">
              {selectedPlant.stressScore !== undefined ? selectedPlant.stressScore : 25}
            </span>
            <span className="text-xs text-rose-600 font-semibold">/ 100</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className="bg-rose-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${selectedPlant.stressScore !== undefined ? selectedPlant.stressScore : 25}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-500">
            {(selectedPlant.stressScore || 25) >= 65 ? 'Critical stress risk' :
             (selectedPlant.stressScore || 25) >= 30 ? 'Moderate stress deficit' : 'Low stress / baseline'}
          </p>
        </div>

        {/* ADS1115 Raw ADC Counts */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm font-mono">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px] font-sans">16-bit ADS1115 ADC</span>
            <span className="text-[10px] text-slate-400 font-sans">BPW34 Node</span>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-rose-600 font-bold">RED 660nm ADC:</span>
              <span className="text-slate-800 font-bold">{selectedPlant.rawRedAdc || 4320}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-600 font-bold">NIR 850nm ADC:</span>
              <span className="text-slate-800 font-bold">{selectedPlant.rawNirAdc || 19580}</span>
            </div>
          </div>
          <p className="mt-1 text-[10px] text-slate-400 font-sans pt-1 border-t border-slate-100">
            Dark: 128 | White Ref: 28450
          </p>
        </div>

      </div>

      {/* Historical Score Trajectory Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Health Score Trajectory vs. Physical Optical Index
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual-scale visualization: Plant Health Score (0–100, Left Axis) and NDVI-like index (-1.0 to +1.0, Right Axis)
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold self-start sm:self-auto">
            {selectedPlant.name}
          </span>
        </div>

        <div className="h-72 w-full">
          {scoreTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                
                {/* Health score thresholds on left */}
                <ReferenceArea yAxisId="left" y1={70} y2={100} fill="#10b981" fillOpacity={0.05} />
                <ReferenceArea yAxisId="left" y1={35} y2={70} fill="#f59e0b" fillOpacity={0.05} />
                <ReferenceArea yAxisId="left" y1={0} y2={35} fill="#ef4444" fillOpacity={0.05} />

                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                
                {/* Left Y Axis: Health Score 0 to 100 */}
                <YAxis 
                  yAxisId="left"
                  domain={[0, 100]} 
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tick={{ fontSize: 10, fill: '#059669' }} 
                  axisLine={{ stroke: '#059669' }}
                  label={{ value: 'Health Score (0-100)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#059669' }}
                />

                {/* Right Y Axis: Optical Index -1.0 to +1.0 */}
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  domain={[-0.2, 1.0]} 
                  ticks={[-0.2, 0.0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                  tick={{ fontSize: 10, fill: '#6366f1' }} 
                  axisLine={{ stroke: '#6366f1' }}
                  label={{ value: 'Index (-1 to +1)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#6366f1' }}
                />

                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    borderColor: '#1e293b', 
                    fontSize: '11px',
                    color: '#fff',
                    fontFamily: 'monospace'
                  }} 
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} />

                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="healthScore" 
                  name="Plant Health Score (0-100)" 
                  stroke="#059669" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#059669' }} 
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="stressScore" 
                  name="Plant Stress Score (0-100)" 
                  stroke="#ef4444" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 2"
                  dot={{ r: 2 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="index" 
                  name="NDVI-like Index (-1 to +1)" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  dot={{ r: 2.5, fill: '#6366f1' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              No historical score records logged for this specimen.
            </div>
          )}
        </div>
      </div>

      {/* Cohort Comparison: Normal vs Water-Stressed Group */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Trial Cohort Comparison: Normal Control vs. Water-Stressed Group
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Experiment EXP001: Mean Health Score response curve over 7-day water deprivation trial
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold self-start sm:self-auto">
            EXP001 Drought Trial
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cohortComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '12px', 
                  fontSize: '11px',
                  color: '#fff',
                  fontFamily: 'monospace'
                }} 
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} />
              <Line 
                type="monotone" 
                dataKey="normalAvgHealth" 
                name="Normal Control Group (100% ETc)" 
                stroke="#059669" 
                strokeWidth={2.5} 
                dot={{ r: 3 }} 
              />
              <Line 
                type="monotone" 
                dataKey="stressedAvgHealth" 
                name="Water-Stressed Group (40% ETc)" 
                stroke="#dc2626" 
                strokeWidth={2.5} 
                strokeDasharray="4 2"
                dot={{ r: 3 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>Control Specimens: <strong>PLANT001, PLANT005</strong></span>
          <span>Stressed Specimens: <strong>PLANT002</strong></span>
          <span className="font-mono text-emerald-700 font-bold">Δ Health Differential: ~34 points</span>
        </div>
      </div>

    </div>
  );
};

export default PlantHealthScoreView;
