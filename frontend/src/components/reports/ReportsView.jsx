import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  Sparkles,
  FileSpreadsheet,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ThresholdBadge from '../common/ThresholdBadge';

const ReportsView = () => {
  const { experiments, plants, readings, thresholds } = useApp();

  const [selectedExperimentId, setSelectedExperimentId] = useState('ALL');
  const [selectedPlantId, setSelectedPlantId] = useState('ALL');
  const [dateRange, setDateRange] = useState('7d');
  const [includeRawLogs, setIncludeRawLogs] = useState(true);
  const [reportGenerated, setReportGenerated] = useState(true);

  const filteredReadings = useMemo(() => {
    return readings.filter(r => {
      const matchExp = selectedExperimentId === 'ALL' || r.experimentId === selectedExperimentId;
      const matchPlant = selectedPlantId === 'ALL' || r.plantId === selectedPlantId;
      return matchExp && matchPlant;
    });
  }, [readings, selectedExperimentId, selectedPlantId]);

  // Aggregate stats for the report
  const reportStats = useMemo(() => {
    if (filteredReadings.length === 0) return { total: 0, meanIndex: 0, meanRed: 0, meanNir: 0, simCount: 0, hwCount: 0 };
    const total = filteredReadings.length;
    const meanIndex = (filteredReadings.reduce((a, b) => a + b.index, 0) / total).toFixed(3);
    const meanRed = (filteredReadings.reduce((a, b) => a + b.redReflectance, 0) / total).toFixed(3);
    const meanNir = (filteredReadings.reduce((a, b) => a + b.nirReflectance, 0) / total).toFixed(3);
    const simCount = filteredReadings.filter(r => r.source !== 'esp32').length;
    const hwCount = filteredReadings.filter(r => r.source === 'esp32').length;

    return { total, meanIndex, meanRed, meanNir, simCount, hwCount };
  }, [filteredReadings]);

  // CSV Export functionality
  const handleExportCSV = () => {
    const headers = [
      'Reading ID',
      'Timestamp',
      'Plant ID',
      'Experiment ID',
      'Device ID',
      'RED Reflectance (660nm)',
      'NIR Reflectance (850nm)',
      'Calculated Index',
      'Data Source',
      'Provisional Classification'
    ];

    const rows = filteredReadings.map(r => [
      r._id,
      r.createdAt || new Date().toISOString(),
      r.plantId,
      r.experimentId,
      r.deviceId,
      r.redReflectance,
      r.nirReflectance,
      r.index,
      r.source || 'simulated',
      r.index >= thresholds.optimal ? 'Optimal' : r.index >= thresholds.moderateStress ? 'Moderate Stress' : 'Severe Stress'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Crop_Analyser_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Optical Phenotyping Reports & Export</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compile formal trial summaries, statistical reflectance aggregates, and export CSV/PDF
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Configuration Controls (Hidden during print) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Report Parameters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 max-w-xl">
            <select
              value={selectedExperimentId}
              onChange={(e) => setSelectedExperimentId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">All Experiments</option>
              {experiments.map(e => (
                <option key={e.id} value={e.id}>{e.id}: {e.name}</option>
              ))}
            </select>

            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">All Monitored Plants</option>
              {plants.map(p => (
                <option key={p.id} value={p.id}>{p.id}: {p.name}</option>
              ))}
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="24h">Past 24 Hours</option>
              <option value="7d">Past 7 Days</option>
              <option value="30d">Past 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Formal Printable Document Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 print:p-0 print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                ACADEMIC RESEARCH REPORT
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-500 text-xs font-mono">Doc ID: CAR-{Date.now().toString().slice(-6)}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">
              Crop Analyser — Optical Reflectance & Plant Stress Assessment
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual-wavelength (660 nm RED / 850 nm NIR) IoT Sensing Chamber Analytics
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <div>Date: <strong>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
            <div className="mt-0.5">Author: <strong>Abhinaya K. (Lead Researcher)</strong></div>
            <div className="mt-0.5 text-slate-400">Status: Provisionally Calibrated</div>
          </div>
        </div>

        {/* Data Source Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>DATA SOURCE & SCIENTIFIC METHODOLOGY DISCLOSURE</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Measurements included in this report comprise <strong>{reportStats.simCount} simulated reading(s)</strong> and <strong>{reportStats.hwCount} actual ESP32 hardware reading(s)</strong>.
            All stress categories are provisional indices based on normalized optical reflectance: <code className="bg-white/80 px-1 py-0.5 rounded font-mono">(NIR - RED) / (NIR + RED)</code>. 
            Validation against standard spectrophotometric chlorophyll extraction is recommended prior to commercial publication.
          </p>
        </div>

        {/* Summary Metric Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Cohort Statistical Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Readings</span>
              <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">{reportStats.total}</span>
              <span className="text-[10px] text-slate-400">Measurement cycles</span>
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 block uppercase font-bold">Mean Cohort Index</span>
              <span className="text-lg font-bold font-mono text-emerald-700 mt-0.5 block">{reportStats.meanIndex}</span>
              <span className="text-[10px] text-slate-400">Provisional index</span>
            </div>

            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200">
              <span className="text-[10px] text-rose-800 block uppercase font-bold">Mean RED (660nm)</span>
              <span className="text-lg font-bold font-mono text-rose-600 mt-0.5 block">{reportStats.meanRed}</span>
              <span className="text-[10px] text-slate-400">Absorption band</span>
            </div>

            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200">
              <span className="text-[10px] text-indigo-800 block uppercase font-bold">Mean NIR (850nm)</span>
              <span className="text-lg font-bold font-mono text-indigo-600 mt-0.5 block">{reportStats.meanNir}</span>
              <span className="text-[10px] text-slate-400">Scattering band</span>
            </div>
          </div>
        </div>

        {/* Plant Specimens Status Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Monitored Specimen Details
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Plant ID</th>
                  <th className="py-2.5 px-3">Specimen Name</th>
                  <th className="py-2.5 px-3">Species</th>
                  <th className="py-2.5 px-3">Experiment</th>
                  <th className="py-2.5 px-3 font-mono">RED (660nm)</th>
                  <th className="py-2.5 px-3 font-mono">NIR (850nm)</th>
                  <th className="py-2.5 px-3 font-mono">Latest Index</th>
                  <th className="py-2.5 px-3">Provisional Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {plants
                  .filter(p => selectedPlantId === 'ALL' || p.id === selectedPlantId)
                  .map(plant => (
                    <tr key={plant.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{plant.id}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{plant.name}</td>
                      <td className="py-2.5 px-3 italic">{plant.species}</td>
                      <td className="py-2.5 px-3 font-mono">{plant.experimentId}</td>
                      <td className="py-2.5 px-3 font-mono text-rose-600">{plant.redReflectance}</td>
                      <td className="py-2.5 px-3 font-mono text-indigo-600">{plant.nirReflectance}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{plant.provisionalIndex}</td>
                      <td className="py-2.5 px-3">
                        <ThresholdBadge status={plant.status} indexValue={plant.provisionalIndex} showProvisional />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Sample Log Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Sensor Sample Measurement Log (First 10 Datapoints)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Plant ID</th>
                  <th className="py-2 px-3 font-mono">RED (660nm)</th>
                  <th className="py-2 px-3 font-mono">NIR (850nm)</th>
                  <th className="py-2 px-3 font-mono">Computed Index</th>
                  <th className="py-2 px-3">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredReadings.slice(0, 10).map(r => (
                  <tr key={r._id}>
                    <td className="py-2 px-3 font-mono text-slate-500">
                      {new Date(r.createdAt || Date.now()).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900">{r.plantId}</td>
                    <td className="py-2 px-3 font-mono text-rose-600 font-bold">{r.redReflectance}</td>
                    <td className="py-2 px-3 font-mono text-indigo-600 font-bold">{r.nirReflectance}</td>
                    <td className="py-2 px-3 font-mono font-bold text-emerald-700">{r.index}</td>
                    <td className="py-2 px-3 font-mono text-[10px] uppercase text-slate-500">
                      {r.source || 'simulated'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Footer */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <span>Crop Analyser Platform • Academic IoT Engineering Prototype</span>
          <span>Verified By: Laboratory Technical Officer</span>
        </div>

      </div>

    </div>
  );
};

export default ReportsView;
