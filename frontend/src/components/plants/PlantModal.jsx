import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Sprout, Check } from 'lucide-react';

const PlantModal = ({ isOpen, onClose, plantToEdit = null }) => {
  const { experiments, addPlant, updatePlant } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    species: 'Solanum lycopersicum',
    variety: '',
    location: '',
    plantingDate: new Date().toISOString().split('T')[0],
    experimentId: experiments[0]?.id || 'EXP001',
    notes: '',
    provisionalIndex: 0.55,
    redReflectance: 0.18,
    nirReflectance: 0.68
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plantToEdit) {
      setFormData({
        name: plantToEdit.name || '',
        species: plantToEdit.species || '',
        variety: plantToEdit.variety || '',
        location: plantToEdit.location || '',
        plantingDate: plantToEdit.plantingDate || new Date().toISOString().split('T')[0],
        experimentId: plantToEdit.experimentId || experiments[0]?.id || 'EXP001',
        notes: plantToEdit.notes || '',
        provisionalIndex: plantToEdit.provisionalIndex || 0.55,
        redReflectance: plantToEdit.redReflectance || 0.18,
        nirReflectance: plantToEdit.nirReflectance || 0.68
      });
    } else {
      setFormData({
        name: '',
        species: 'Solanum lycopersicum',
        variety: '',
        location: 'Greenhouse Bench A',
        plantingDate: new Date().toISOString().split('T')[0],
        experimentId: experiments[0]?.id || 'EXP001',
        notes: '',
        provisionalIndex: 0.55,
        redReflectance: 0.18,
        nirReflectance: 0.68
      });
    }
    setErrors({});
  }, [plantToEdit, isOpen, experiments]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Plant specimen name is required';
    if (!formData.species.trim()) errs.species = 'Botanical species is required';
    if (!formData.variety.trim()) errs.variety = 'Cultivar or variety is required';
    if (!formData.location.trim()) errs.location = 'Chamber or greenhouse location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (plantToEdit) {
      updatePlant(plantToEdit.id, formData);
    } else {
      addPlant(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plantToEdit ? `Edit Plant Specimen (${plantToEdit.id})` : 'Register New Plant Specimen'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Plant Specimen Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Tomato Specimen B-4"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Botanical Species *
            </label>
            <input
              type="text"
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              placeholder="e.g. Solanum lycopersicum"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs italic font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.species && <p className="text-rose-600 text-[11px] mt-0.5">{errors.species}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Cultivar / Variety *
            </label>
            <input
              type="text"
              value={formData.variety}
              onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
              placeholder="e.g. Roma VF / Heirloom"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.variety && <p className="text-rose-600 text-[11px] mt-0.5">{errors.variety}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Facility Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Chamber A — Bay 3"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.location && <p className="text-rose-600 text-[11px] mt-0.5">{errors.location}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Planting Date
            </label>
            <input
              type="date"
              value={formData.plantingDate}
              onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Assign to Experiment
          </label>
          <select
            value={formData.experimentId}
            onChange={(e) => setFormData({ ...formData, experimentId: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {experiments.map(exp => (
              <option key={exp.id} value={exp.id}>
                {exp.id}: {exp.name} ({exp.treatment})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Research Notes & Observations
          </label>
          <textarea
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Record phenotypic observations, seedling age, lighting regimen..."
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
            <span>{plantToEdit ? 'Save Changes' : 'Register Specimen'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default PlantModal;
