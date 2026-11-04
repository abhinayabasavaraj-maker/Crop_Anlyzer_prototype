import React from 'react';
import { Sprout, Activity, Eye, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ThresholdBadge from '../common/ThresholdBadge';

const PlantSummaryCards = ({ onSelectPlant }) => {
  const { plants, setActiveTab, setLiveMonitoring } = useApp();

  const handleLaunchLive = (plantId, experimentId) => {
    setLiveMonitoring(prev => ({
      ...prev,
      selectedPlantId: plantId,
      selectedExperimentId: experimentId || prev.selectedExperimentId,
      active: true
    }));
    setActiveTab('live');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Plant Monitoring Summary</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time status across experimental batches</p>
        </div>
        <button
          onClick={() => setActiveTab('plants')}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
        >
          <span>View All ({plants.length})</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {plants.slice(0, 4).map(plant => (
          <div 
            key={plant.id}
            className="p-3.5 rounded-xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/50 hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {plant.id}
                </span>
                <ThresholdBadge status={plant.status} indexValue={plant.provisionalIndex} showProvisional />
              </div>

              <h4 className="font-bold text-slate-900 text-xs mt-2.5 truncate" title={plant.name}>
                {plant.name}
              </h4>
              <p className="text-[11px] text-slate-500 italic truncate">{plant.species}</p>
              
              <div className="mt-3 bg-white p-2.5 rounded-lg border border-slate-100 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Index:</span>
                  <span className="font-bold text-slate-800">{plant.provisionalIndex}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>RED (660nm):</span>
                  <span>{plant.redReflectance}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>NIR (850nm):</span>
                  <span>{plant.nirReflectance}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-slate-400">
                {plant.experimentId}
              </span>
              <button
                onClick={() => handleLaunchLive(plant.id, plant.experimentId)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
                title="Start live monitoring chamber for this plant"
              >
                <Activity className="w-3 h-3" />
                <span>Live Monitor</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantSummaryCards;
