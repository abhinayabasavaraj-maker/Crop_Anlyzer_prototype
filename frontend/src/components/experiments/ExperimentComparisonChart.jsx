import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useApp } from '../../context/AppContext';

const ExperimentComparisonChart = () => {
  const { experiments, plants, readings } = useApp();

  const comparisonData = useMemo(() => {
    return experiments.map(exp => {
      // Find plants belonging to this experiment
      const expPlants = plants.filter(p => p.experimentId === exp.id || exp.plantIds?.includes(p.id));
      
      let avgIndex = 0;
      let avgRed = 0;
      let avgNir = 0;

      if (expPlants.length > 0) {
        const sumIndex = expPlants.reduce((acc, p) => acc + (p.provisionalIndex || 0), 0);
        const sumRed = expPlants.reduce((acc, p) => acc + (p.redReflectance || 0), 0);
        const sumNir = expPlants.reduce((acc, p) => acc + (p.nirReflectance || 0), 0);

        avgIndex = parseFloat((sumIndex / expPlants.length).toFixed(3));
        avgRed = parseFloat((sumRed / expPlants.length).toFixed(3));
        avgNir = parseFloat((sumNir / expPlants.length).toFixed(3));
      }

      return {
        id: exp.id,
        name: exp.id,
        fullName: exp.name,
        treatment: exp.treatment,
        plantCount: expPlants.length,
        avgIndex,
        avgRed,
        avgNir
      };
    });
  }, [experiments, plants]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Cross-Experiment Treatment Comparison</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Mean normalized optical reflectance and provisional indices across trial groups
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold self-start sm:self-auto">
          Mean Treatment Response
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1 font-mono">
                      <p className="font-sans font-bold text-slate-200">{data.fullName}</p>
                      <p className="text-[10px] text-slate-400 font-sans">{data.treatment}</p>
                      <div className="pt-1.5 border-t border-slate-800 space-y-0.5">
                        <div className="text-emerald-400 font-bold">Mean Index: {data.avgIndex}</div>
                        <div className="text-rose-400">Mean RED (660nm): {data.avgRed}</div>
                        <div className="text-indigo-400">Mean NIR (850nm): {data.avgNir}</div>
                        <div className="text-slate-400 text-[10px]">Specimens: {data.plantCount}</div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} />
            <Bar dataKey="avgRed" name="Mean RED (660nm)" fill="#e11d48" radius={[4, 4, 0, 0]} />
            <Bar dataKey="avgNir" name="Mean NIR (850nm)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar dataKey="avgIndex" name="Mean Index" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExperimentComparisonChart;
