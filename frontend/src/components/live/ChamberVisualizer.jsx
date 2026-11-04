import React from 'react';
import { Radio, Zap, Shield, Sparkles, Battery, Wifi, Cpu, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ChamberVisualizer = () => {
  const { liveMonitoring, devices, plants, projectMetadata } = useApp();
  const { active, chamberLightState, selectedDeviceId, selectedPlantId, rawAdcCounts, latestLiveReading } = liveMonitoring;

  const currentDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const currentPlant = plants.find(p => p.id === selectedPlantId) || plants[0];

  const isCurrentLiveMatch = latestLiveReading && latestLiveReading.plantId === selectedPlantId;
  const redVal = isCurrentLiveMatch ? latestLiveReading.redReflectance : (currentPlant?.redReflectance || 0.18);
  const nirVal = isCurrentLiveMatch ? latestLiveReading.nirReflectance : (currentPlant?.nirReflectance || 0.68);
  const indexVal = isCurrentLiveMatch ? latestLiveReading.index : (currentPlant?.provisionalIndex || 0.58);
  const statusVal = isCurrentLiveMatch 
    ? (indexVal >= 0.45 ? 'Healthy' : indexVal >= 0.20 ? 'Moderate Stress' : 'Severe Stress')
    : (currentPlant?.status || 'Healthy');

  return (
    <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
      
      {/* Light glow effects during sequential pulse */}
      {chamberLightState === 'RED_660NM' && (
        <div className="absolute inset-0 bg-red-600/15 pointer-events-none transition-all duration-300 blur-2xl animate-pulse" />
      )}
      {chamberLightState === 'NIR_850NM' && (
        <div className="absolute inset-0 bg-indigo-600/15 pointer-events-none transition-all duration-300 blur-2xl animate-pulse" />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <h3 className="text-sm font-bold tracking-tight text-white">
              Light-Sealed Optical Chamber & 1.8" TFT Local Display
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Single BPW34 photodiode + ADS1115 (16-bit) + Sequential 660nm/850nm illumination
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2 py-1 bg-slate-800 rounded-md text-slate-300 border border-slate-700">
            {currentDevice?.id || selectedDeviceId}
          </span>
          <span className={`px-2 py-1 rounded-md font-bold ${
            active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
          }`}>
            {active ? 'SEQUENTIAL SCAN' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Main Chamber & TFT Grid */}
      <div className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Optical Measurement Chamber (7 cols) */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/80 border border-slate-800/80 min-h-[240px]">
          
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-4 font-mono">
            Optical Shroud Interior (&lt; 0.01 lux ambient leakage)
          </div>

          {/* Sequential Emitters & Photodiode */}
          <div className="flex items-center gap-8 mb-4">
            
            {/* RED LED (660 nm) */}
            <div className="flex flex-col items-center">
              <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                chamberLightState === 'RED_660NM'
                  ? 'bg-red-500 border-red-300 shadow-[0_0_25px_rgba(239,68,68,0.9)] scale-110'
                  : 'bg-red-950/50 border-red-900/60 text-red-700'
              }`}>
                <Zap className={`w-5 h-5 ${chamberLightState === 'RED_660NM' ? 'text-white' : 'text-red-600'}`} />
              </div>
              <span className="text-[10px] font-mono font-bold mt-2 text-red-400">RED 660 nm</span>
              <span className="text-[9px] text-slate-400 font-mono">
                {chamberLightState === 'RED_660NM' ? 'PULSING NOW' : 'Pulse 1'}
              </span>
            </div>

            {/* Central SINGLE BPW34 Photodiode + Transimpedance Amp */}
            <div className="flex flex-col items-center px-4 py-2.5 bg-slate-900 rounded-xl border border-slate-700 text-center">
              <Radio className={`w-6 h-6 ${active ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="text-[10px] font-mono text-emerald-400 mt-1 font-bold">BPW34 PHOTODIODE</span>
              <span className="text-[9px] text-slate-400 font-mono">Single Sensor + TIA</span>
            </div>

            {/* NIR LED (850 nm) */}
            <div className="flex flex-col items-center">
              <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                chamberLightState === 'NIR_850NM'
                  ? 'bg-indigo-500 border-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.9)] scale-110'
                  : 'bg-indigo-950/50 border-indigo-900/60 text-indigo-700'
              }`}>
                <Zap className={`w-5 h-5 ${chamberLightState === 'NIR_850NM' ? 'text-white' : 'text-indigo-400'}`} />
              </div>
              <span className="text-[10px] font-mono font-bold mt-2 text-indigo-400">NIR 850 nm</span>
              <span className="text-[9px] text-slate-400 font-mono">
                {chamberLightState === 'NIR_850NM' ? 'PULSING NOW' : 'Pulse 2'}
              </span>
            </div>

          </div>

          {/* Sequential light beam animation */}
          {chamberLightState === 'RED_660NM' && (
            <div className="w-52 h-4 bg-gradient-to-b from-red-500/50 to-transparent blur-sm animate-pulse" />
          )}
          {chamberLightState === 'NIR_850NM' && (
            <div className="w-52 h-4 bg-gradient-to-b from-indigo-500/50 to-transparent blur-sm animate-pulse" />
          )}

          {/* Leaf Sample Stage */}
          <div className="mt-3 flex flex-col items-center">
            <div className="px-5 py-2 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs font-semibold shadow-lg">
              <span>🌿</span>
              <span>Sample: {currentPlant?.name || selectedPlantId}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">
              ADS1115 ADC: RED ~{rawAdcCounts.red} | NIR ~{rawAdcCounts.nir} counts
            </span>
          </div>

        </div>

        {/* Right: 1.8" TFT Display Local Emulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 font-mono flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>On-Device 1.8" ST7735 TFT Screen</span>
          </div>

          {/* Physical TFT Bezel & Pixel Screen */}
          <div className="w-56 p-3 bg-slate-950 rounded-2xl border-4 border-slate-700 shadow-2xl shadow-black/80 font-mono">
            {/* TFT Screen Interior */}
            <div className="bg-black p-3 rounded-lg border border-slate-800 text-left space-y-2 text-xs select-none">
              
              {/* Screen Top Status bar */}
              <div className="flex items-center justify-between text-[10px] border-b border-slate-800 pb-1 text-slate-400">
                <span className="text-emerald-400 font-bold">CROP ANALYSER</span>
                <span className="flex items-center gap-1 text-[9px]">
                  <Battery className="w-3 h-3 text-emerald-400" />
                  <span>3.9V</span>
                </span>
              </div>

              {/* Plant ID */}
              <div>
                <span className="text-[9px] text-slate-400 block">ID:</span>
                <span className="text-white font-bold text-[11px] truncate block">{currentPlant?.id}</span>
              </div>

              {/* Spectral Readings */}
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <div className="bg-slate-900/90 p-1.5 rounded">
                  <span className="text-red-400 block text-[9px]">RED 660:</span>
                  <span className="text-white font-bold">{redVal}</span>
                </div>
                <div className="bg-slate-900/90 p-1.5 rounded">
                  <span className="text-indigo-400 block text-[9px]">NIR 850:</span>
                  <span className="text-white font-bold">{nirVal}</span>
                </div>
              </div>

              {/* Calculated Index */}
              <div className="bg-emerald-950/60 border border-emerald-500/30 p-1.5 rounded text-center">
                <span className="text-[9px] text-emerald-400 block">NDVI-LIKE INDEX</span>
                <span className="text-base font-black text-emerald-300">{indexVal}</span>
              </div>

              {/* Plant Status */}
              <div className="flex items-center justify-between text-[10px] pt-0.5">
                <span className="text-slate-400">STATUS:</span>
                <span className={`font-bold uppercase text-[10px] ${
                  statusVal === 'Healthy' ? 'text-emerald-400' :
                  statusVal === 'Moderate Stress' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {statusVal}
                </span>
              </div>

              {/* Footer */}
              <div className="text-[8px] text-slate-400 text-center pt-1 border-t border-slate-900">
                BMSCE ECE+CSE • Wi-Fi TX OK
              </div>

            </div>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-1.5">
            ESP32 Local Screen Display Emulator (128x160)
          </span>
        </div>

      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-800 pt-3 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">Optical Cycle:</span>
          <span>
            {chamberLightState === 'RED_660NM' ? 'PHASE 1: 660nm RED ILLUMINATION' :
             chamberLightState === 'NIR_850NM' ? 'PHASE 2: 850nm NIR ILLUMINATION' : 
             active ? 'AWAITING NEXT CADENCE CYCLE' : 'IDLE / READY'}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Source: <strong className="text-amber-400">SIMULATED SENSOR DATA</strong> (BPW34 Sequential Pulse Model)
        </div>
      </div>
    </div>
  );
};

export default ChamberVisualizer;
