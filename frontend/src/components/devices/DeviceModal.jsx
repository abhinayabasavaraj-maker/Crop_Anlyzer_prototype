import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Cpu, Check } from 'lucide-react';

const DeviceModal = ({ isOpen, onClose, deviceToEdit = null }) => {
  const { plants, addDevice, updateDevice } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    firmwareVersion: 'v1.2.4-opt',
    status: 'Online',
    assignedPlantId: plants[0]?.id || 'PLANT001',
    location: '',
    redLedWavelength: 660,
    nirLedWavelength: 850,
    calibratedDarkCurrent: 12,
    calibratedWhiteRef: 3840
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deviceToEdit) {
      setFormData({
        name: deviceToEdit.name || '',
        firmwareVersion: deviceToEdit.firmwareVersion || 'v1.2.4-opt',
        status: deviceToEdit.status || 'Online',
        assignedPlantId: deviceToEdit.assignedPlantId || plants[0]?.id || 'PLANT001',
        location: deviceToEdit.location || '',
        redLedWavelength: deviceToEdit.redLedWavelength || 660,
        nirLedWavelength: deviceToEdit.nirLedWavelength || 850,
        calibratedDarkCurrent: deviceToEdit.calibratedDarkCurrent || 12,
        calibratedWhiteRef: deviceToEdit.calibratedWhiteRef || 3840
      });
    } else {
      setFormData({
        name: '',
        firmwareVersion: 'v1.2.4-opt',
        status: 'Online',
        assignedPlantId: plants[0]?.id || 'PLANT001',
        location: 'Chamber Bay A',
        redLedWavelength: 660,
        nirLedWavelength: 850,
        calibratedDarkCurrent: 12,
        calibratedWhiteRef: 3840
      });
    }
    setErrors({});
  }, [deviceToEdit, isOpen, plants]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Device name is required';
    if (!formData.location.trim()) errs.location = 'Chamber location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (deviceToEdit) {
      updateDevice(deviceToEdit.id, formData);
    } else {
      addDevice(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deviceToEdit ? `Configure Node (${deviceToEdit.id})` : 'Register ESP32 Hardware Node'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Device Hardware Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Optical Chamber A3 (ESP32-WROOM)"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {errors.name && <p className="text-rose-600 text-[11px] mt-0.5">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Firmware Version
            </label>
            <input
              type="text"
              value={formData.firmwareVersion}
              onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Connection Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Online">Online</option>
              <option value="Standby">Standby</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Assign to Specimen Plant
            </label>
            <select
              value={formData.assignedPlantId}
              onChange={(e) => setFormData({ ...formData, assignedPlantId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {plants.map(p => (
                <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Physical Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Chamber 1 — Bay 4"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.location && <p className="text-rose-600 text-[11px] mt-0.5">{errors.location}</p>}
          </div>
        </div>

        {/* Optical Sensor Calibration parameters */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            ESP32 ADC Calibration Standard Offsets:
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-600 block">Dark Current (ADC count)</label>
              <input
                type="number"
                value={formData.calibratedDarkCurrent}
                onChange={(e) => setFormData({ ...formData, calibratedDarkCurrent: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono"
              />
              <span className="text-[9px] text-slate-400">Zero light bias offset</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 block">99% White Ref (ADC count)</label>
              <input
                type="number"
                value={formData.calibratedWhiteRef}
                onChange={(e) => setFormData({ ...formData, calibratedWhiteRef: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono"
              />
              <span className="text-[9px] text-slate-400">BaSO4 standard reference</span>
            </div>
          </div>
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
            <span>{deviceToEdit ? 'Save Changes' : 'Register Node'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default DeviceModal;
