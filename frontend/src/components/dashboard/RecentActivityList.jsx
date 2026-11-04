import React from 'react';
import { Activity, AlertTriangle, FlaskConical, Radio, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RecentActivityList = () => {
  const { readings, alerts, experiments, plants, setActiveTab } = useApp();

  // Combine top recent events
  const recentEvents = [
    ...readings.slice(0, 4).map(r => {
      const pl = plants.find(p => p.id === r.plantId);
      return {
        id: `reading_${r._id}`,
        type: 'reading',
        title: `Optical Measurement Logged`,
        description: `${pl ? pl.name : r.plantId} • Index: ${r.index} (RED ${r.redReflectance}, NIR ${r.nirReflectance})`,
        time: new Date(r.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: r.source,
        icon: Activity,
        color: 'emerald'
      };
    }),
    ...alerts.slice(0, 2).map(a => ({
      id: `alert_${a.id}`,
      type: 'alert',
      title: `${a.severity} Alert: ${a.plantName}`,
      description: a.description,
      time: new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'system',
      icon: AlertTriangle,
      color: a.severity === 'Critical' ? 'rose' : 'amber'
    }))
  ].slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Activity Stream</h3>
          <p className="text-xs text-slate-500 mt-0.5">Sensor measurements, triggers, and alerts</p>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Live feed
        </span>
      </div>

      <div className="space-y-3">
        {recentEvents.map(event => {
          const Icon = event.icon;
          return (
            <div key={event.id} className="flex items-start gap-3 text-xs p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                event.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                event.color === 'rose' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800 truncate">{event.title}</p>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{event.time}</span>
                </div>
                <p className="text-slate-500 text-[11px] truncate mt-0.5">{event.description}</p>
                {event.source && (
                  <span className="inline-block mt-1 text-[9px] font-mono uppercase px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded">
                    Source: {event.source}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityList;
