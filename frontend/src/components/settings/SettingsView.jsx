import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  SlidersHorizontal, 
  Wifi, 
  Check, 
  RefreshCw, 
  ShieldAlert,
  Database,
  Radio,
  Save,
  GraduationCap,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SettingsView = () => {
  const { thresholds, updateThresholds, backendStatus, checkBackend, projectMetadata } = useApp();

  // User Profile with BMSCE metadata
  const [profile, setProfile] = useState({
    name: 'BMSCE Project Research Team',
    institution: 'BMS College of Engineering, Bengaluru',
    department: 'Electronics & Communication Engineering (ECE) + Computer Science & Engineering (CSE)',
    role: 'Undergraduate Capstone Project Group',
    projectGuide: 'Dr. K. N. Ramesh / Dr. H. N. Suma (Faculty Mentors)',
    trlStatus: 'TRL 2 (Targeting TRL 3 Prototype by August 2027)'
  });

  const [localThresholds, setLocalThresholds] = useState({ ...thresholds });
  const [thresholdSaved, setThresholdSaved] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    updateThresholds({
      optimal: parseFloat(localThresholds.optimal),
      moderateStress: parseFloat(localThresholds.moderateStress),
      severeStress: parseFloat(localThresholds.severeStress),
      suddenDropDelta: parseFloat(localThresholds.suddenDropDelta)
    });
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 2500);
  };

  const handleTestBackend = async () => {
    setIsTestingApi(true);
    await checkBackend();
    setTimeout(() => setIsTestingApi(false), 500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveProfileSuccess(true);
    setTimeout(() => setSaveProfileSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      
      {/* Top Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">System Configuration & Academic Metadata</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          BMS College of Engineering (ECE + CSE) Project Settings, TRL Benchmarks, and Provisional Calibration
        </p>
      </div>

      {/* BMSCE Academic Capstone Profile */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Academic Capstone Metadata</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Institution</label>
              <input
                type="text"
                value={profile.institution}
                onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Multidisciplinary Departments</label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Project Research Team</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Technology Readiness Level (TRL)</label>
              <input
                type="text"
                value={profile.trlStatus}
                onChange={(e) => setProfile({ ...profile, trlStatus: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saveProfileSuccess ? 'Metadata Saved' : 'Save Institutional Metadata'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Provisional Index Thresholds Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Provisional Plant Health Index Cutoffs
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configurable thresholds for NDVI-like index [-1.0 to +1.0]. Updating limits immediately updates classifications platform-wide.
            </p>
          </div>
          <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-bold">
            PROVISIONAL CALIBRATION
          </span>
        </div>

        <form onSubmit={handleSaveThresholds} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Optimal / Healthy */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30">
              <label className="text-xs font-bold text-emerald-900 block mb-1">
                Optimal Healthy Cutoff (≥)
              </label>
              <input
                type="number"
                step="0.05"
                min="-1"
                max="1"
                value={localThresholds.optimal}
                onChange={(e) => setLocalThresholds({ ...localThresholds, optimal: e.target.value })}
                className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-[10px] text-emerald-700 block mt-1">Default: +0.45</span>
            </div>

            {/* Moderate Stress */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30">
              <label className="text-xs font-bold text-amber-900 block mb-1">
                Moderate Stress Cutoff (≥)
              </label>
              <input
                type="number"
                step="0.05"
                min="-1"
                max="1"
                value={localThresholds.moderateStress}
                onChange={(e) => setLocalThresholds({ ...localThresholds, moderateStress: e.target.value })}
                className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <span className="text-[10px] text-amber-700 block mt-1">Default: +0.20</span>
            </div>

            {/* Severe Stress */}
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30">
              <label className="text-xs font-bold text-rose-900 block mb-1">
                Severe Stress Cutoff (&lt;)
              </label>
              <input
                type="number"
                step="0.05"
                min="-1"
                max="1"
                value={localThresholds.severeStress}
                onChange={(e) => setLocalThresholds({ ...localThresholds, severeStress: e.target.value })}
                className="w-full bg-white border border-rose-300 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
              <span className="text-[10px] text-rose-700 block mt-1">Default: +0.20</span>
            </div>

            {/* Sudden Drop Sensitivity */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Sudden Drop Delta (Δ)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.5"
                value={localThresholds.suddenDropDelta}
                onChange={(e) => setLocalThresholds({ ...localThresholds, suddenDropDelta: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
              />
              <span className="text-[10px] text-slate-500 block mt-1">24h drop delta: 0.15</span>
            </div>

          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 italic">
              Scientific Notice: Index ranges strictly from -1.00 to +1.00. Calibrate experimentally per crop variety.
            </span>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{thresholdSaved ? 'Thresholds Updated!' : 'Apply & Save Thresholds'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backend API Integration Diagnostics */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Backend Gateway & Node.js Server Status
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status of Express.js backend server and MongoDB Atlas integration layer
            </p>
          </div>

          <button
            onClick={handleTestBackend}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingApi ? 'animate-spin' : ''}`} />
            <span>Ping Backend Now</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">API Endpoint</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">
              {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}
            </span>
            <span className="text-[10px] text-emerald-600 font-sans mt-0.5 block">
              Health check: /api/health
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Express Server</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-sm font-bold text-slate-900">
                {backendStatus.online ? 'ONLINE & RESPONDING' : 'OFFLINE'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-sans mt-0.5 block">
              Latency: {backendStatus.latencyMs ? `${backendStatus.latencyMs} ms` : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Database State</span>
            <div className="flex items-center gap-2 mt-1">
              <Database className={`w-3.5 h-3.5 ${backendStatus.isDbLive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-sm font-bold text-slate-900 capitalize">
                {backendStatus.dbStatus || 'Disconnected'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-sans mt-0.5 block">
              {backendStatus.isDbLive ? 'MongoDB Atlas Cluster connected' : 'In-memory fallback active'}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between font-mono">
          <span>Supported REST Endpoint: <strong>POST /api/readings</strong></span>
          <span className="text-emerald-700 font-bold">Index Range: -1.0 to +1.0</span>
        </div>
      </div>

    </div>
  );
};

export default SettingsView;
