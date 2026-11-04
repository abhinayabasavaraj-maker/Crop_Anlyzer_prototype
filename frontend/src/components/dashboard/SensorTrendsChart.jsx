import React, { useState, useMemo } from 'react';
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
import { useApp } from '../../context/AppContext';
import { Layers } from 'lucide-react';

const SensorTrendsChart = () => {
  const { plants, readings } = useApp();
  const [selectedPlantId, setSelectedPlantId] = useState(plants[0]?.id || 'PLANT001');

  const chartData = useMemo(() => {
    return readings
      .filter(r => r.plantId === selectedPlantId)
      .slice(0, 20)
      .reverse()
      .map((r, i) => {
        const d = new Date(r.createdAt || Date.now());
        return {
          time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          red: r.redReflectance,
          nir: r.nirReflectance,
          index: r.index,
          id: r._id
        };
      });
  }, [readings, selectedPlantId]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Spectral Reflectance Dynamics</h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-medium border border-emerald-200">
              660nm vs 850nm
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Chlorophyll absorption (RED) vs Spongy Mesophyll scattering (NIR)
          </p>
        </div>

        <select
          value={selectedPlantId}
          onChange={(e) => setSelectedPlantId(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          {plants.map(p => (
            <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
          ))}
        </select>
      </div>

      <div className="h-60 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1 border border-slate-800 font-mono">
                        <div className="text-slate-400 font-sans font-semibold mb-1">{label}</div>
                        <div className="text-rose-400">RED (660nm): {payload[0]?.value}</div>
                        <div className="text-indigo-400">NIR (850nm): {payload[1]?.value}</div>
                        <div className="text-emerald-400 font-bold border-t border-slate-800 pt-1">
                          Index: {payload[2]?.value}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} 
              />
              <Line 
                type="monotone" 
                dataKey="red" 
                name="RED 660nm Reflectance" 
                stroke="#e11d48" 
                strokeWidth={2} 
                dot={{ r: 2.5 }} 
              />
              <Line 
                type="monotone" 
                dataKey="nir" 
                name="NIR 850nm Reflectance" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                dot={{ r: 2.5 }} 
              />
              <Line 
                type="monotone" 
                dataKey="index" 
                name="Calculated Index" 
                stroke="#059669" 
                strokeWidth={2.5} 
                strokeDasharray="4 2"
                dot={{ r: 3 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs">
            No readings recorded for this specimen.
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorTrendsChart;
