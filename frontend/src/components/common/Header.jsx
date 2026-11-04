import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Activity, 
  RefreshCw,
  Clock,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header = () => {
  const { 
    activeTab, 
    alerts, 
    backendStatus, 
    checkBackend, 
    demoMode, 
    setDemoMode,
    globalSearch,
    setGlobalSearch,
    setActiveTab,
    projectMetadata
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [rechecking, setRechecking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlertsCount = alerts.filter(a => !a.isResolved).length;

  const handleManualCheck = async () => {
    setRechecking(true);
    await checkBackend();
    setTimeout(() => setRechecking(false), 500);
  };

  const getTabLabel = (tab) => {
    const map = {
      overview: 'Dashboard Overview',
      live: 'Live Sensor Monitoring',
      plants: 'Plant Management',
      experiments: 'Experiments & Cohort Trials',
      'health-score': 'Plant Health & Stress Scoring',
      analytics: 'Sensor Analytics & Reflectance Trends',
      'ai-screening': 'AI-Assisted Disease Screening',
      treatment: 'Plant Treatment & Prevention Assistance',
      alerts: 'Stress Alerts & Hardware Events',
      devices: 'ESP32 Device Management',
      reports: 'Reports & Export',
      settings: 'System & Calibration Settings'
    };
    return map[tab] || 'Crop Analyser';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left: View Title & Current Time */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                {getTabLabel(activeTab)}
              </h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                BMSCE ECE+CSE
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-sm mx-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search plants, experiments, diseases (e.g. Tomato, EXP001, Blight)..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Status Indicators, Demo Mode, Alerts & Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Demo Mode Badge */}
          <div 
            onClick={() => setDemoMode(!demoMode)}
            className={`cursor-pointer px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all select-none ${
              demoMode 
                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Click to toggle Demo Mode"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">
              {demoMode ? 'SIMULATED SENSOR DATA' : 'HARDWARE SENSOR MODE'}
            </span>
            <span className="sm:hidden font-mono text-[10px]">
              {demoMode ? 'SIM' : 'HW'}
            </span>
          </div>

          {/* Backend Status Pill */}
          <div 
            onClick={handleManualCheck}
            className={`cursor-pointer px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              backendStatus.online 
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50/60 border-rose-200 text-rose-800'
            }`}
            title={`API Endpoint: http://localhost:5000/api (Click to re-ping)`}
          >
            <span className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span className="font-mono text-[10px] hidden sm:inline">
              {backendStatus.online ? `API :5000 (${backendStatus.latencyMs ?? 5}ms)` : 'API Offline'}
            </span>
            <RefreshCw className={`w-3 h-3 text-slate-400 ${rechecking ? 'animate-spin' : ''}`} />
          </div>

          {/* Alerts Bell */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200"
            title="View system alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User Profile Chip */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              BM
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">BMSCE Research</p>
              <p className="text-[9px] text-slate-400 leading-none mt-1">ECE + CSE Scholar</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
