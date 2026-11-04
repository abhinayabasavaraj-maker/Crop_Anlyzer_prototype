import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { FlaskConical, Check } from 'lucide-react';

const ExperimentModal = ({ isOpen, onClose, expToEdit = null }) => {
  const { plants, addExperiment, updateExperiment } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    treatment: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    plantIds: [],
    leadResearcher: 'Dr. A. Sharma',
    notes: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expToEdit) {
      setFormData({
        name: expToEdit.name || '',
        description: expToEdit.description || '',
        treatment: expToEdit.treatment || '',
        startDate: expToEdit.startDate || '',
        endDate: expToEdit.endDate || '',
        plantIds: expToEdit.plantIds || [],
        leadResearcher: expToEdit.leadResearcher || 'Dr. A. Sharma',
        notes: expToEdit.notes || '',
        status: expToEdit.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        treatment: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        plantIds: [],
        leadResearcher: 'Dr. A. Sharma',
        notes: '',
        status: 'Active'
      });
    }
    setErrors({});
  }, [expToEdit, isOpen]);

  const togglePlantSelect = (plantId) => {
    setFormData(prev => {
      const exists = prev.plantIds.includes(plantId);
      return {
        ...prev,
        plantIds: exists ? prev.plantIds.filter(id => id !== plantId) : [...prev.plantIds, plantId]
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Experiment name is required';
    if (!formData.treatment.trim()) errs.treatment = 'Treatment condition is required';
    if (!formData.startDate) errs.startDate = 'Start date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (expToEdit) {
      updateExperiment(expToEdit.id, formData);
    } else {
      addExperiment(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expToEdit ? `Edit Experiment (${expToEdit.id})` : 'Initiate New Research Experiment'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Experiment Title *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Drought Deficit Stress Induction"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.name}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Treatment / Experimental Variable *
          </label>
          <input
            type="text"
            value={formData.treatment}
            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            placeholder="e.g. 50% ETc Deficit Irrigation vs 100% Control"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.treatment && <p className="text-rose-600 text-[11px] mt-0.5">{errors.treatment}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Description & Hypotheses
          </label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief research scope, objective, and physiological targets..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.startDate && <p className="text-rose-600 text-[11px] mt-0.5">{errors.startDate}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Estimated End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
            </select>
          </div>
        </div>

        {/* Multi-plant Association */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Associate Specimen Plants ({formData.plantIds.length} selected):
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
            {plants.map(p => {
              const selected = formData.plantIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePlantSelect(p.id)}
                  className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    selected ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{p.id}: {p.name}</span>
                  {selected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Research Protocol Notes
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Chamber settings, calibration targets, sampling schedule..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{expToEdit ? 'Save Changes' : 'Create Experiment'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default ExperimentModal;
