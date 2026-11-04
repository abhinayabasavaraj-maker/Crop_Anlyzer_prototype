import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Filter, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Sparkles,
  Maximize2,
  Layers,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import MetricCard from '../common/MetricCard';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceArea
} from 'recharts';

const AnalyticsView = () => {
  const { plants, experiments, readings, thresholds } = useApp();

  // Filter states
  const [selectedExperimentId, setSelectedExperimentId] = useState('ALL');
  const [selectedPlantIds, setSelectedPlantIds] = useState(['PLANT001', 'PLANT002', 'PLANT003']);
  const [metricMode, setMetricMode] = useState('index'); // 'index' | 'red' | 'nir'
  const [timeRange, setTimeRange] = useState('7d'); // '24h' | '7d' | '30d'

  // Toggle plant selection for multi-line comparison
  const togglePlantSelection = (plantId) => {
    setSelectedPlantIds(prev => {
      if (prev.includes(plantId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(id => id !== plantId);
      }
      return [...prev, plantId];
    });
  };

  // Filtered readings
  const filteredReadings = useMemo(() => {
    return readings.filter(r => {
      const matchExp = selectedExperimentId === 'ALL' || r.experimentId === selectedExperimentId;
      const matchPlant = selectedPlantIds.includes(r.plantId);
      return matchExp && matchPlant;
    });
  }, [readings, selectedExperimentId, selectedPlantIds]);

  // Compute aggregate statistics
  const stats = useMemo(() => {
    if (filteredReadings.length === 0) {
      return { count: 0, meanIndex: 0, minIndex: 0, maxIndex: 0, meanRed: 0, meanNir: 0 };
    }
    const indices = filteredReadings.map(r => r.index);
    const reds = filteredReadings.map(r => r.redReflectance);
    const nirs = filteredReadings.map(r => r.nirReflectance);

    const sum = arr => arr.reduce((a, b) => a + b, 0);
    const mean = arr => (sum(arr) / arr.length).toFixed(3);

    return {
      count: filteredReadings.length,
      meanIndex: mean(indices),
      minIndex: Math.min(...indices).toFixed(3),
      maxIndex: Math.max(...indices).toFixed(3),
      meanRed: mean(reds),
      meanNir: mean(nirs)
    };
  }, [filteredReadings]);

  // Pivot chart data by timestamp for multi-plant line overlay
  const comparativeChartData = useMemo(() => {
    // Group readings by 12-hour or time buckets
    const timeMap = new Map();

    filteredReadings.slice(0, 80).reverse().forEach(r => {
      const d = new Date(r.createdAt || Date.now());
      const key = d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
                  d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (!timeMap.has(key)) {
        timeMap.set(key, { time: key, timestamp: d.getTime() });
      }
      const entry = timeMap.get(key);
      const val = metricMode === 'index' ? r.index : metricMode === 'red' ? r.redReflectance : r.nirReflectance;
      entry[r.plantId] = val;
    });

    return Array.from(timeMap.values()).sort((a, b) => a.timestamp - b.timestamp);
  }, [filteredReadings, metricMode]);

  // Distinct palette for plant lines
  const plantColorMap = {
    PLANT001: '#059669', // Emerald
    PLANT002: '#d97706', // Amber
    PLANT003: '#2563eb', // Blue
    PLANT004: '#dc2626', // Red
    PLANT005: '#7c3aed', // Purple
    PLANT006: '#0891b2', // Cyan
    PLANT007: '#ea580c', // Orange
    PLANT008: '#be123c', // Rose
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Sensor Analytics & Optical Trends</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-specimen reflectance trajectory, comparative indices, and aggregate metrics
          </p>
        </div>

        {/* Metric Mode Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setMetricMode('index')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              metricMode === 'index' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Plant Health Index
          </button>
          <button
            onClick={() => setMetricMode('red')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              metricMode === 'red' ? 'bg-white text-rose-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            RED 660nm
          </button>
          <button
            onClick={() => setMetricMode('nir')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              metricMode === 'nir' ? 'bg-white text-indigo-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NIR 850nm
          </button>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Filtered Datapoints</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{stats.count}</p>
          <span className="text-[10px] text-slate-500">Total samples</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm bg-gradient-to-br from-white to-emerald-50/20">
          <span className="text-[10px] font-bold text-emerald-800 uppercase">Mean Index</span>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-1">{stats.meanIndex}</p>
          <span className="text-[10px] text-slate-500">Average across cohort</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-sm bg-gradient-to-br from-white to-rose-50/20">
          <span className="text-[10px] font-bold text-rose-800 uppercase">Min Index</span>
          <p className="text-xl font-bold font-mono text-rose-700 mt-1">{stats.minIndex}</p>
          <span className="text-[10px] text-slate-500">Lowest stress point</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Max Index</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{stats.maxIndex}</p>
          <span className="text-[10px] text-slate-500">Highest vitality</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-rose-700 uppercase">Mean RED (660nm)</span>
          <p className="text-xl font-bold font-mono text-rose-600 mt-1">{stats.meanRed}</p>
          <span className="text-[10px] text-slate-500">Chlorophyll band</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-indigo-700 uppercase">Mean NIR (850nm)</span>
          <p className="text-xl font-bold font-mono text-indigo-600 mt-1">{stats.meanNir}</p>
          <span className="text-[10px] text-slate-500">Mesophyll band</span>
        </div>
      </div>

      {/* Filter Toolbar & Specimen Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Comparative Specimen Selection:
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedExperimentId}
              onChange={(e) => setSelectedExperimentId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">All Experiments</option>
              {experiments.map(exp => (
                <option key={exp.id} value={exp.id}>{exp.id}: {exp.name}</option>
              ))}
            </select>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="24h">Past 24 Hours</option>
              <option value="7d">Past 7 Days</option>
              <option value="30d">Past 30 Days</option>
            </select>
          </div>
        </div>

        {/* Specimen Badges Multi-select */}
        <div className="flex flex-wrap gap-2 pt-1">
          {plants.map(plant => {
            const isSelected = selectedPlantIds.includes(plant.id);
            const color = plantColorMap[plant.id] || '#059669';

            return (
              <button
                key={plant.id}
                onClick={() => togglePlantSelection(plant.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: color }}
                />
                <span>{plant.id}</span>
                <span className="text-[10px] opacity-75 font-normal">({plant.name.split(' ')[0]})</span>
                {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Comparative Multi-Line Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {metricMode === 'index' ? 'Comparative Health Index Trajectory' :
               metricMode === 'red' ? 'Comparative RED (660nm) Reflectance Trajectory' :
               'Comparative NIR (850nm) Reflectance Trajectory'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing {selectedPlantIds.length} plant specimens across time
            </p>
          </div>

          <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            {metricMode.toUpperCase()}
          </span>
        </div>

        <div className="h-80 w-full">
          {comparativeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparativeChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                
                {metricMode === 'index' && (
                  <>
                    <ReferenceArea y1={thresholds.optimal} y2={1.0} fill="#10b981" fillOpacity={0.05} />
                    <ReferenceArea y1={thresholds.moderateStress} y2={thresholds.optimal} fill="#f59e0b" fillOpacity={0.05} />
                    <ReferenceArea y1={0} y2={thresholds.severeStress} fill="#ef4444" fillOpacity={0.05} />
                  </>
                )}

                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
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

                {selectedPlantIds.map(plantId => {
                  const plant = plants.find(p => p.id === plantId);
                  const color = plantColorMap[plantId] || '#059669';
                  return (
                    <Line
                      key={plantId}
                      type="monotone"
                      dataKey={plantId}
                      name={`${plantId} (${plant?.name?.split(' ')[0] || ''})`}
                      stroke={color}
                      strokeWidth={2}
                      dot={{ r: 2.5 }}
                      activeDot={{ r: 6 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              No matching readings found for the selected specimens and filters.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsView;
