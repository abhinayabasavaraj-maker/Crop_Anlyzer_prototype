import React from 'react';
import { Cpu, Wifi, WifiOff, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DeviceStatusList = () => {
  const { devices, plants, setActiveTab } = useApp();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">ESP32 Device Status</h3>
          <p className="text-xs text-slate-500 mt-0.5">Hardware chambers and photodetector nodes</p>
        </div>
        <button
          onClick={() => setActiveTab('devices')}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
        >
          <span>Manage All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-3">
        {devices.map(device => {
          const isOnline = device.status === 'Online';
          const isStandby = device.status === 'Standby';
          const assignedPlant = plants.find(p => p.id === device.assignedPlantId);

          return (
            <div 
              key={device.id} 
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isOnline ? 'bg-emerald-100 text-emerald-800' :
                  isStandby ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{device.id}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                      isOnline ? 'bg-emerald-100 text-emerald-800' :
                      isStandby ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {device.name} • {device.location}
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-[11px]">
                <div className="text-slate-700 font-medium">
                  {assignedPlant ? assignedPlant.name : 'Unassigned'}
                </div>
                <div className="text-slate-400 text-[10px]">
                  {device.voltageV}V • {device.signalStrengthDbm} dBm
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceStatusList;
