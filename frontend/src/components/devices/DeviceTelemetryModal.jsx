import React from 'react';
import Modal from '../common/Modal';
import { Cpu, ShieldCheck, Zap, Radio, Activity, Wifi, Battery, GraduationCap } from 'lucide-react';

const DeviceTelemetryModal = ({ isOpen, onClose, device }) => {
  if (!device) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`BMSCE Hardware Telemetry — ${device.id}`} maxWidth="max-w-xl">
      <div className="space-y-4 text-xs">
        
        {/* Device ID Header Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">{device.name}</p>
              <p className="text-slate-400 font-mono text-[11px]">{device.hardware || 'ESP32 DevKit V1 + BPW34 + ADS1115'}</p>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
            device.status === 'Online' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'
          }`}>
            {device.status}
          </span>
        </div>

        {/* Optical Sensor Calibration Matrix */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ADS1115 16-bit ADC & BPW34 Photodiode Offsets
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
              16-bit (0 - 32767 Single-Ended)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">Dark Count</span>
              <span className="text-sm font-bold text-slate-800">{device.calibratedDarkCurrentAdc || 128}</span>
              <span className="text-[9px] text-slate-400 block font-sans">Zero light offset</span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">White Standard</span>
              <span className="text-sm font-bold text-slate-800">{device.calibratedWhiteRefAdc || 28450}</span>
              <span className="text-[9px] text-slate-400 block font-sans">99% BaSO4 ref</span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">RED LED Band</span>
              <span className="text-sm font-bold text-rose-600">~660 nm</span>
              <span className="text-[9px] text-slate-400 block font-sans">Chlorophyll abs.</span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-sans">NIR LED Band</span>
              <span className="text-sm font-bold text-indigo-600">~850 nm</span>
              <span className="text-[9px] text-slate-400 block font-sans">Mesophyll scat.</span>
            </div>
          </div>
        </div>

        {/* Power & Subsystem Specs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">18650 Battery</span>
            <span className="text-base font-bold font-mono text-slate-800 mt-1 block">
              {device.batteryVoltageV || 3.90} V ({device.batteryLevelPct || 80}%)
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">TP4056 Regulated</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Local TFT</span>
            <span className="text-base font-bold font-mono text-slate-800 mt-1 block">1.8" ST7735</span>
            <span className="text-[10px] text-slate-500 font-medium">SPI 128x160</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Wi-Fi RSSI</span>
            <span className="text-base font-bold font-mono text-slate-800 mt-1 block">{device.signalStrengthDbm} dBm</span>
            <span className="text-[10px] text-emerald-600 font-medium">HTTP REST Link</span>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="p-3.5 bg-slate-900 rounded-xl text-slate-300 font-mono text-[11px] space-y-1.5 border border-slate-800">
          <div className="flex items-center justify-between text-emerald-400 font-bold font-sans">
            <span>ESP32 Wi-Fi HTTP POST Contract:</span>
            <span className="text-[10px] text-slate-400">POST /api/readings</span>
          </div>
          <pre className="bg-slate-950 p-2 rounded text-[10px] text-slate-300 overflow-x-auto">
{`{
  "plantId": "${device.assignedPlantId || 'PLANT001'}",
  "experimentId": "EXP001",
  "deviceId": "${device.id}",
  "redReflectance": 0.18,
  "nirReflectance": 0.72,
  "index": 0.6000,
  "rawRedAdc": 4320,
  "rawNirAdc": 19580,
  "source": "esp32"
}`}
          </pre>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Close Diagnostics
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default DeviceTelemetryModal;
