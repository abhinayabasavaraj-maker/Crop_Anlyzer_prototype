import React, { useState } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Calendar, 
  Sprout, 
  Edit3, 
  Trash2, 
  User, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ExperimentModal from './ExperimentModal';
import ExperimentComparisonChart from './ExperimentComparisonChart';
import Modal from '../common/Modal';
import ThresholdBadge from '../common/ThresholdBadge';

const ExperimentManagementView = () => {
  const { experiments, plants, deleteExperiment, setActiveTab, setLiveMonitoring } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expToEdit, setExpToEdit] = useState(null);
  const [expToDelete, setExpToDelete] = useState(null);

  const confirmDelete = () => {
    if (expToDelete) {
      deleteExperiment(expToDelete.id);
      setExpToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Research Experiments & Trials</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize plant batches, treatment variables, drought regimes, and salinity gradients
          </p>
        </div>

        <button
          onClick={() => { setExpToEdit(null); setIsModalOpen(true); }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-900/20 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Initiate Experiment</span>
        </button>
      </div>

      {/* Comparison Chart */}
      <ExperimentComparisonChart />

      {/* Experiments Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {experiments.map(exp => {
          const associatedPlants = plants.filter(p => p.experimentId === exp.id || exp.plantIds?.includes(p.id));

          return (
            <div 
              key={exp.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
                    {exp.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    exp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {exp.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3">{exp.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.description}</p>

                {/* Treatment Pill */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Treatment Protocol</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{exp.treatment}</span>
                </div>

                {/* Timeline */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exp.startDate}</span>
                  <span>→</span>
                  <span>{exp.endDate || 'Ongoing'}</span>
                </div>

                {/* Associated Plants */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                    Associated Specimen Plants ({associatedPlants.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {associatedPlants.map(p => (
                      <span 
                        key={p.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        <span className="font-mono font-bold text-slate-900">{p.id}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[80px]">({p.name})</span>
                      </span>
                    ))}
                    {associatedPlants.length === 0 && (
                      <span className="text-slate-400 text-xs italic">No plants assigned yet.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{exp.leadResearcher || 'Research Team'}</span>
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setExpToEdit(exp); setIsModalOpen(true); }}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit Experiment"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setExpToDelete(exp)}
                    className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Experiment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <ExperimentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expToEdit={expToEdit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!expToDelete}
        onClose={() => setExpToDelete(null)}
        title="Confirm Experiment Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure you want to delete this experiment?</p>
              <p className="mt-1 text-rose-700 leading-relaxed">
                Deleting <strong>{expToDelete?.name} ({expToDelete?.id})</strong> will unassign affiliated plants and remove its aggregated analytical trends.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setExpToDelete(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
            >
              Yes, Delete Experiment
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ExperimentManagementView;
