import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Filter, 
  Trash2, 
  Clock, 
  Cpu, 
  Sprout,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AlertsView = () => {
  const { alerts, resolveAlert, clearResolvedAlerts, setActiveTab, setLiveMonitoring } = useApp();

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ACTIVE'); // 'ACTIVE' | 'RESOLVED' | 'ALL'

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
      const matchStatus = 
        statusFilter === 'ALL' || 
        (statusFilter === 'ACTIVE' && !alert.isResolved) ||
        (statusFilter === 'RESOLVED' && alert.isResolved);
      return matchSeverity && matchStatus;
    });
  }, [alerts, severityFilter, statusFilter]);

  const criticalCount = alerts.filter(a => a.severity === 'Critical' && !a.isResolved).length;
  const warningCount = alerts.filter(a => a.severity === 'Warning' && !a.isResolved).length;
  const infoCount = alerts.filter(a => a.severity === 'Info' && !a.isResolved).length;
  const resolvedCount = alerts.filter(a => a.isResolved).length;

  const handleInspectInLive = (plantId, deviceId) => {
    setLiveMonitoring(prev => ({
      ...prev,
      selectedPlantId: plantId || prev.selectedPlantId,
      selectedDeviceId: deviceId || prev.selectedDeviceId,
      active: true
    }));
    setActiveTab('live');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">System Stress Alerts & Optical Diagnostics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts triggered by provisional optical thresholds, rate of index change, and device telemetry
          </p>
        </div>

        {resolvedCount > 0 && (
          <button
            onClick={clearResolvedAlerts}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear Resolved ({resolvedCount})</span>
          </button>
        )}
      </div>

      {/* Severity Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-800 uppercase">Critical Alerts</span>
            <p className="text-2xl font-bold font-mono text-rose-700 mt-1">{criticalCount}</p>
            <span className="text-[11px] text-slate-500">Immediate attention</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase">Warnings</span>
            <p className="text-2xl font-bold font-mono text-amber-700 mt-1">{warningCount}</p>
            <span className="text-[11px] text-slate-500">Sudden drop / deviations</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-sky-800 uppercase">Advisories & Info</span>
            <p className="text-2xl font-bold font-mono text-sky-700 mt-1">{infoCount}</p>
            <span className="text-[11px] text-slate-500">Routine calibrations</span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-100 text-sky-800">
            <Info className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase">Resolved Events</span>
            <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">{resolvedCount}</p>
            <span className="text-[11px] text-slate-500">Acknowledged by team</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filter Alerts:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'ACTIVE' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('RESOLVED')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'RESOLVED' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Resolved
            </button>
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              All
            </button>
          </div>

          {/* Severity selector */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="Warning">Warning Only</option>
            <option value="Info">Advisory Only</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'Critical';
            const isWarning = alert.severity === 'Warning';
            const isResolved = alert.isResolved;

            return (
              <div 
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isResolved 
                    ? 'bg-slate-50/70 border-slate-200 opacity-70' 
                    : isCritical 
                    ? 'bg-white border-rose-300 shadow-sm ring-1 ring-rose-200' 
                    : isWarning 
                    ? 'bg-white border-amber-300 shadow-sm' 
                    : 'bg-white border-sky-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isCritical ? 'bg-rose-100 text-rose-800' :
                    isWarning ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {isCritical ? <AlertCircle className="w-5 h-5" /> :
                     isWarning ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isCritical ? 'bg-rose-100 text-rose-800' :
                        isWarning ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {alert.severity}
                      </span>

                      <span className="font-bold text-slate-900 text-xs">
                        {alert.plantName}
                      </span>

                      <span className="font-mono text-[11px] text-slate-400">
                        ({alert.plantId})
                      </span>

                      {alert.deviceId && (
                        <span className="font-mono text-[11px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          {alert.deviceId}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {alert.description}
                    </p>

                    {alert.calibrationNote && (
                      <p className="text-[11px] text-amber-700 bg-amber-50/70 px-2 py-0.5 rounded mt-1.5 inline-block font-mono">
                        Note: {alert.calibrationNote}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleInspectInLive(alert.plantId, alert.deviceId)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {!isResolved ? (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
                      Resolved
                    </span>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">No alerts matching current filters</p>
            <p className="text-slate-400 mt-0.5">All monitored optical channels are within acceptable ranges.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AlertsView;
