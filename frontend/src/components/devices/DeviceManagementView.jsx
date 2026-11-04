import React, { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Wifi, 
  WifiOff, 
  Radio, 
  Edit3, 
  Trash2, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Clock,
  AlertCircle,
  Battery
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DeviceModal from './DeviceModal';
import DeviceTelemetryModal from './DeviceTelemetryModal';
import Modal from '../common/Modal';

const DeviceManagementView = () => {
  const { devices, plants, deleteDevice, setActiveTab, setLiveMonitoring } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [deviceTelemetry, setDeviceTelemetry] = useState(null);
  const [deviceToDelete, setDeviceToDelete] = useState(null);

  const confirmDelete = () => {
    if (deviceToDelete) {
      deleteDevice(deviceToDelete.id);
      setDeviceToDelete(null);
    }
  };

  const handleLaunchLive = (device) => {
    setLiveMonitoring(prev => ({
      ...prev,
      selectedDeviceId: device.id,
      selectedPlantId: device.assignedPlantId || prev.selectedPlantId,
      active: true
    }));
    setActiveTab('live');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">ESP32 Device Nodes & Hardware Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            BMSCE Optical Sensing Hardware: ESP32 DevKit V1, BPW34 Photodiode, ADS1115 16-bit ADC & 1.8" TFT Display
          </p>
        </div>

        <button
          onClick={() => { setDeviceToEdit(null); setIsAddModalOpen(true); }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-900/20 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register ESP32 Node</span>
        </button>
      </div>

      {/* Hardware Architecture Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold tracking-tight text-white">
                BMSCE Handheld Optical Sensing Architecture (TRL 2 → TRL 3)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Equipped with an <strong>ESP32 DevKit V1</strong> microcontroller, a single <strong>BPW34 PIN photodiode</strong>, 
              sequential <strong>660 nm RED / 850 nm NIR</strong> illumination, <strong>ADS1115 16-bit ADC</strong>, transimpedance amplifier, 
              a <strong>1.8-inch TFT color display</strong>, and an <strong>18650 Li-ion battery + TP4056 module</strong>. 
              The ESP32 serves as the primary device calculating the NDVI-like index before Wi-Fi transmission.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-sans">Active Units</span>
              <span className="font-bold text-emerald-400 text-sm">
                {devices.filter(d => d.status === 'Online').length} / {devices.length}
              </span>
            </div>
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-sans">ADC Mode</span>
              <span className="font-bold text-slate-200 text-sm">ADS1115 (16-bit)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {devices.map(device => {
          const isOnline = device.status === 'Online';
          const isStandby = device.status === 'Standby';
          const assignedPlant = plants.find(p => p.id === device.assignedPlantId);

          return (
            <div 
              key={device.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      isOnline ? 'bg-emerald-100 text-emerald-800' :
                      isStandby ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900 block">{device.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{device.firmwareVersion}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isOnline ? 'bg-emerald-100 text-emerald-800' :
                    isStandby ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {device.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-xs mt-3 truncate">{device.name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{device.location}</p>

                {/* Assigned Specimen Info */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Specimen</span>
                  <div className="font-semibold text-slate-800 mt-0.5 truncate">
                    {assignedPlant ? `${assignedPlant.name} (${assignedPlant.id})` : 'Unassigned'}
                  </div>
                  {assignedPlant && (
                    <span className="text-[10px] text-emerald-700 font-mono block mt-0.5">
                      Latest Index: {assignedPlant.provisionalIndex}
                    </span>
                  )}
                </div>

                {/* Telemetry snippet */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                  <div className="p-1.5 bg-white rounded border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-sans">Battery (18650)</span>
                    <span className="font-bold text-slate-800">{device.batteryVoltageV || 3.90}V ({device.batteryLevelPct || 80}%)</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-100">
                    <span className="text-[9px] text-slate-400 block font-sans">Signal</span>
                    <span className="font-bold text-slate-800">{device.signalStrengthDbm} dBm</span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Last comm: {new Date(device.lastPing).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setDeviceTelemetry(device)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Diagnostics</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleLaunchLive(device)}
                    className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Live Monitor with this Device"
                  >
                    <Activity className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setDeviceToEdit(device); setIsAddModalOpen(true); }}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Device Settings"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeviceToDelete(device)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Device"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Device Modal */}
      <DeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        deviceToEdit={deviceToEdit}
      />

      {/* Technical Diagnostics Modal */}
      <DeviceTelemetryModal
        isOpen={!!deviceTelemetry}
        onClose={() => setDeviceTelemetry(null)}
        device={deviceTelemetry}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deviceToDelete}
        onClose={() => setDeviceToDelete(null)}
        title="Confirm Device Node Removal"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure you want to remove this hardware node?</p>
              <p className="mt-1 text-rose-700 leading-relaxed">
                Removing <strong>{deviceToDelete?.name} ({deviceToDelete?.id})</strong> will unbind it from its assigned chamber.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setDeviceToDelete(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
            >
              Yes, Remove Device
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default DeviceManagementView;
