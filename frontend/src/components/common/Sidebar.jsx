import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Sprout, 
  FlaskConical, 
  HeartPulse,
  BarChart3, 
  ScanSearch,
  BookOpenCheck,
  AlertTriangle, 
  Cpu, 
  FileText, 
  Settings,
  Leaf,
  Radio,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { activeTab, setActiveTab, alerts, liveMonitoring, devices, projectMetadata } = useApp();

  const unreadAlerts = alerts.filter(a => !a.isResolved).length;
  const onlineDevicesCount = devices.filter(d => d.status === 'Online').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { 
      id: 'live', 
      label: 'Live Monitoring', 
      icon: Activity,
      badge: liveMonitoring.active ? 'ACTIVE' : null,
      badgeColor: 'bg-emerald-500 text-white animate-pulse'
    },
    { id: 'plants', label: 'Plant Management', icon: Sprout },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'health-score', label: 'Plant Health Score', icon: HeartPulse },
    { id: 'analytics', label: 'Sensor Analytics', icon: BarChart3 },
    { id: 'ai-screening', label: 'AI Disease Screening', icon: ScanSearch },
    { id: 'treatment', label: 'Treatment Assistance', icon: BookOpenCheck },
    { 
      id: 'alerts', 
      label: 'Alerts', 
      icon: AlertTriangle,
      badge: unreadAlerts > 0 ? unreadAlerts : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    { 
      id: 'devices', 
      label: 'Device Management', 
      icon: Cpu,
      badge: `${onlineDevicesCount}/${devices.length}`,
      badgeColor: 'bg-slate-200 text-slate-700 font-mono'
    },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-800 min-h-screen">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
            <Leaf className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>Crop Analyser</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-mono font-medium rounded border border-emerald-500/30">
                TRL 2
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">BMSCE ECE + CSE Project</p>
          </div>
        </div>

        {/* College Tag */}
        <div className="mt-2.5 px-2 py-1 bg-slate-850 rounded-md border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5 font-sans">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">BMS College of Engineering</span>
        </div>
      </div>

      {/* Navigation List (12 items) */}
      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          System Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Hardware Architecture Snippet */}
      <div className="p-3 m-2.5 bg-slate-850/80 rounded-xl border border-slate-800 text-[10px]">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            Hardware BOM
          </span>
          <span className="font-mono text-[9px] text-emerald-400 font-bold">ADS1115 (16-bit)</span>
        </div>
        
        <div className="space-y-0.5 font-mono text-[9px] text-slate-400">
          <div className="flex justify-between">
            <span className="text-slate-400">Detector:</span>
            <span className="text-slate-200">BPW34 Photodiode</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Emitters:</span>
            <span className="text-slate-200">660nm & 850nm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Display:</span>
            <span className="text-slate-200">1.8" TFT ST7735</span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('live')}
          className="mt-2.5 w-full py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-1 text-[10px] transition-colors"
        >
          <span>Open Chamber Emulator</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Footer Version & Target */}
      <div className="px-4 py-2.5 border-t border-slate-800/80 text-[9px] text-slate-400 flex items-center justify-between font-mono">
        <span>TRL 2 → TRL 3</span>
        <span className="text-emerald-400 font-medium">Aug 2027 Target</span>
      </div>

    </aside>
  );
};

export default Sidebar;
