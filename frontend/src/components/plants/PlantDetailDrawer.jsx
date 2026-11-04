import React, { useMemo } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import ThresholdBadge from '../common/ThresholdBadge';
import { Activity, Calendar, MapPin, FlaskConical, FileText, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PlantDetailDrawer = ({ isOpen, onClose, plant }) => {
  const { readings, experiments, setActiveTab, setLiveMonitoring } = useApp();

  const plantReadings = useMemo(() => {
    if (!plant) return [];
    return readings.filter(r => r.plantId === plant.id).slice(0, 20);
  }, [readings, plant]);

  if (!plant) return null;

  const assignedExperiment = experiments.find(e => e.id === plant.experimentId);

  const miniChartData = [...plantReadings].reverse().map(r => ({
    time: new Date(r.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    index: r.index,
    red: r.redReflectance,
    nir: r.nirReflectance
  }));

  const handleLaunchLive = () => {
    setLiveMonitoring(prev => ({
      ...prev,
      selectedPlantId: plant.id,
      selectedExperimentId: plant.experimentId || prev.selectedExperimentId,
      active: true
    }));
    onClose();
    setActiveTab('live');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Plant Specimen Profile — ${plant.name}`} maxWidth="max-w-2xl">
      <div className="space-y-5">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {plant.id}
              </span>
              <ThresholdBadge status={plant.status} indexValue={plant.provisionalIndex} showProvisional />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">{plant.name}</h3>
            <p className="text-xs text-slate-500 italic">{plant.species} • Variety: {plant.variety}</p>
          </div>

          <button
            onClick={handleLaunchLive}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors self-start sm:self-center"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Monitor</span>
          </button>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-100 bg-white">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Facility Location</span>
            <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{plant.location}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-100 bg-white">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Planting Date</span>
            <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{plant.plantingDate}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-100 bg-white">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">RED Reflectance</span>
            <span className="text-base font-bold font-mono text-rose-600 block mt-0.5">
              {plant.redReflectance}
            </span>
            <span className="text-[10px] text-slate-400">~660 nm</span>
          </div>

          <div className="p-3 rounded-lg border border-slate-100 bg-white">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">NIR Reflectance</span>
            <span className="text-base font-bold font-mono text-indigo-600 block mt-0.5">
              {plant.nirReflectance}
            </span>
            <span className="text-[10px] text-slate-400">~850 nm</span>
          </div>
        </div>

        {/* Experiment Affiliation */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Assigned Research Experiment</span>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">{assignedExperiment?.name || plant.experimentId}</p>
              <p className="text-slate-600 text-[11px] mt-0.5">{assignedExperiment?.treatment || 'Baseline treatment'}</p>
            </div>
            <span className="font-mono text-xs px-2 py-1 bg-white rounded border border-slate-200 text-slate-700">
              {plant.experimentId}
            </span>
          </div>
        </div>

        {/* Notes */}
        {plant.notes && (
          <div className="p-3 rounded-xl border border-slate-100 bg-white text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Researcher Notes</span>
            <p className="text-slate-700 leading-relaxed">{plant.notes}</p>
          </div>
        )}

        {/* Historical Mini Chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recent Index Trajectory
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              {plantReadings.length} measurement points
            </span>
          </div>
          <div className="h-44 w-full bg-slate-50 rounded-xl p-3 border border-slate-200">
            {miniChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={miniChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 9 }} axisLine={{ stroke: '#cbd5e1' }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 9 }} axisLine={{ stroke: '#cbd5e1' }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="index" stroke="#059669" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No readings recorded for this specimen.
              </div>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};

export default PlantDetailDrawer;
