import React, { useState, useMemo } from 'react';
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
import { useApp } from '../../context/AppContext';
import { Activity, Info } from 'lucide-react';

const PlantHealthChart = () => {
  const { plants, readings, thresholds } = useApp();
  const [selectedPlantId, setSelectedPlantId] = useState(plants[0]?.id || 'PLANT001');

  // Filter and sort historical readings for the selected plant
  const chartData = useMemo(() => {
    const plantReadings = readings
      .filter(r => r.plantId === selectedPlantId)
      .slice(0, 25)
      .reverse();

    return plantReadings.map((r, idx) => {
      const date = new Date(r.createdAt || Date.now());
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return {
        point: idx + 1,
        time: `${dateStr} ${timeStr}`,
        timestamp: timeStr,
        index: r.index,
        red: r.redReflectance,
        nir: r.nirReflectance,
        source: r.source || 'simulated'
      };
    });
  }, [readings, selectedPlantId]);

  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Plant Health Index Timeline</h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              Provisional Index
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized difference index (NIR - RED)/(NIR + RED) calculated over measurement cycles
          </p>
        </div>

        {/* Plant Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Specimen:</label>
          <select
            value={selectedPlantId}
            onChange={(e) => setSelectedPlantId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            {plants.map(p => (
              <option key={p.id} value={p.id}>
                {p.id}: {p.name} ({p.species})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Threshold Zone Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-3 text-[11px] font-medium text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
        <span className="font-semibold text-slate-700">Provisional Classification:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Optimal (&gt;= {thresholds.optimal})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Moderate Stress ({thresholds.moderateStress} - {thresholds.optimal})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Severe Stress (&lt; {thresholds.severeStress})</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              
              {/* Provisional threshold zones */}
              <ReferenceArea y1={thresholds.optimal} y2={1.0} fill="#10b981" fillOpacity={0.06} />
              <ReferenceArea y1={thresholds.moderateStress} y2={thresholds.optimal} fill="#f59e0b" fillOpacity={0.06} />
              <ReferenceArea y1={0} y2={thresholds.severeStress} fill="#ef4444" fillOpacity={0.06} />
              
              <ReferenceLine y={thresholds.optimal} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.7} />
              <ReferenceLine y={thresholds.severeStress} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.7} />

              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={{ stroke: '#e2e8f0' }} 
              />
              <YAxis 
                domain={[0, 1]} 
                ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
                tick={{ fontSize: 11, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={{ stroke: '#e2e8f0' }} 
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                        <p className="font-semibold text-slate-300">{data.time}</p>
                        <div className="flex items-center justify-between gap-4 font-mono">
                          <span className="text-emerald-400">Index:</span>
                          <span className="font-bold">{data.index}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 font-mono text-[11px] text-slate-400">
                          <span>RED (660nm):</span>
                          <span>{data.red}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 font-mono text-[11px] text-slate-400">
                          <span>NIR (850nm):</span>
                          <span>{data.nir}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-800 text-[10px] text-amber-400 font-mono">
                          Source: {data.source.toUpperCase()}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="index" 
                name="Calculated Index" 
                stroke="#059669" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#059669', strokeWidth: 1.5, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No sensor readings logged for this plant yet.
          </div>
        )}
      </div>

      {selectedPlant && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{selectedPlant.name}</span>
            <span className="text-slate-400">•</span>
            <span>Variety: <strong className="text-slate-700">{selectedPlant.variety}</strong></span>
            <span className="text-slate-400">•</span>
            <span>Location: <strong className="text-slate-700">{selectedPlant.location}</strong></span>
          </div>
          <div className="font-mono text-[11px]">
            Latest Index: <strong className="text-emerald-700">{selectedPlant.provisionalIndex}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantHealthChart;
