import React, { useState } from 'react';
import { 
  ScanSearch, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Eye, 
  RefreshCw,
  Cpu,
  FileCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AI_DISEASE_PRESETS } from '../../data/demoData';

const AiDiseaseScreeningView = () => {
  const { plants, screeningHistory, runAiScreening, setActiveTab } = useApp();

  const [selectedPlantId, setSelectedPlantId] = useState(plants[0]?.id || 'PLANT001');
  const [selectedSpecies, setSelectedSpecies] = useState('Solanum lycopersicum');
  const [selectedPresetId, setSelectedPresetId] = useState(AI_DISEASE_PRESETS[0].id);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeResult, setActiveResult] = useState(screeningHistory[0] || null);

  const selectedPlant = plants.find(p => p.id === selectedPlantId) || plants[0];
  const currentPreset = AI_DISEASE_PRESETS.find(p => p.id === selectedPresetId) || AI_DISEASE_PRESETS[0];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = runAiScreening(selectedPlantId, selectedSpecies, uploadedImagePreview, currentPreset);
      setActiveResult(result);
      setIsAnalyzing(false);
    }, 900);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Disclaimer & Architecture Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <ScanSearch className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                AI-Assisted Leaf Image Disease Screening
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                PyTorch / CNN Subsystem
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              <strong>Multi-Source Evidence Principle:</strong> The handheld RED (660nm) and NIR (850nm) sensor measures <em>internal physiological cellular stress</em> before lesions appear. 
              The AI Disease Screening module evaluates <em>macroscopic foliar visual patterns</em> using Convolutional Neural Networks. 
              These are <strong>separate, complementary lines of evidence</strong>. Neither replaces laboratory pathology or confirmed agronomist inspection.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-[11px] shrink-0 space-y-1">
            <div className="text-slate-400 font-sans font-bold text-[10px] uppercase">Target Model Architecture:</div>
            <div className="text-indigo-400 font-bold">MobileNetV3 / ResNet-50</div>
            <div className="text-slate-400 text-[10px]">Trained on Leaf Pathology Dataset</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Screening Controls vs. Inference Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Selection & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Leaf Specimen Photograph Input</span>
            </h3>

            {/* Plant & Species Selection */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Associate with Plant Specimen
                </label>
                <select
                  value={selectedPlantId}
                  onChange={(e) => setSelectedPlantId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {plants.map(p => (
                    <option key={p.id} value={p.id}>{p.id}: {p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Botanical Species
                </label>
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Solanum lycopersicum">Solanum lycopersicum (Tomato)</option>
                  <option value="Triticum aestivum">Triticum aestivum (Wheat)</option>
                  <option value="Capsicum annuum">Capsicum annuum (Bell Pepper / Chilli)</option>
                  <option value="Solanum tuberosum">Solanum tuberosum (Potato)</option>
                </select>
              </div>
            </div>

            {/* Reference Sample Preset Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Load Test Foliar Sample:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {AI_DISEASE_PRESETS.map(preset => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => { setSelectedPresetId(preset.id); setUploadedImagePreview(null); }}
                      className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected 
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-bold">{preset.predictedCondition}</span>
                        <span className="block text-[10px] text-slate-400 font-sans truncate">{preset.plantSpecies}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        preset.severityLevel === 'Healthy' ? 'bg-emerald-100 text-emerald-800' :
                        preset.severityLevel === 'Uncertain' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {Math.round(preset.confidence * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upload Custom Image Input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Or Upload Field Leaf Image:
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:border-indigo-400 transition-colors bg-slate-50/50">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageFileChange} 
                  className="hidden" 
                  id="leaf-upload" 
                />
                <label htmlFor="leaf-upload" className="cursor-pointer flex flex-col items-center gap-1 text-slate-500">
                  <Upload className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-700">Choose photograph</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG under 10MB</span>
                </label>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-900/20 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing CNN Inference...</span>
                </>
              ) : (
                <>
                  <ScanSearch className="w-4 h-4" />
                  <span>Run AI Disease Screening</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: AI Model Output & Evidence Correlation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeResult ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
              
              {/* Result Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Screening ID: {activeResult.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeResult.isInconclusive 
                        ? 'bg-amber-100 text-amber-800' 
                        : activeResult.predictedCondition.includes('Healthy') 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {activeResult.isInconclusive ? 'UNCERTAIN CONFIDENCE' : 'PRELIMINARY INDICATION'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {activeResult.predictedCondition}
                  </h3>
                  <p className="text-xs text-slate-500 italic">
                    Pathogen / Category: {activeResult.pathogen}
                  </p>
                </div>

                {/* Confidence Badge */}
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Model Confidence</div>
                  <div className="text-2xl font-black font-mono text-indigo-700 mt-0.5">
                    {(activeResult.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Confidence Threshold: 70% Cutoff</span>
                  <span className={activeResult.confidence >= 0.70 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                    {activeResult.confidence >= 0.70 ? 'High Confidence Classification' : 'Low Confidence / Re-sample Required'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      activeResult.confidence >= 0.85 ? 'bg-emerald-500' :
                      activeResult.confidence >= 0.70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${activeResult.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Inconclusive Warning if low confidence */}
              {activeResult.isInconclusive && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Inconclusive Result:</span> Confidence is insufficient to establish a reliable class. 
                    Inspect sample under diffused lighting and cross-check optical RED/NIR sensor index.
                  </div>
                </div>
              )}

              {/* Foliar Symptoms & Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Characteristic Visual Symptoms
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {activeResult.symptoms}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Recommended Further Inspection
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {activeResult.recommendedInspection}
                  </p>
                </div>
              </div>

              {/* Combined Multi-Evidence Panel */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-indigo-900 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Multi-Source Correlation with Optical Sensor
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500 block font-sans text-[10px]">Associated Plant</span>
                    <span className="font-bold text-slate-800">{activeResult.plantId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-sans text-[10px]">Optical Sensor Index</span>
                    <span className="font-bold text-emerald-700">{activeResult.associatedIndex}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-sans text-[10px]">Correlation Status</span>
                    <span className="font-bold text-slate-800">
                      {activeResult.associatedIndex > 0.50 && activeResult.predictedCondition.includes('Healthy') ? 'Consistent Vitality' :
                       activeResult.associatedIndex < 0.40 ? 'Dual Evidence of Stress' : 'Independent Indicator'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action to Treatment Assistance */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-slate-400 italic">
                  Note: AI predictions are screening tools, not legal agricultural diagnoses.
                </span>
                <button
                  onClick={() => setActiveTab('treatment')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>View Treatment Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              <ScanSearch className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No AI screening performed yet</p>
              <p className="text-slate-400 mt-0.5">Select a specimen and click "Run AI Disease Screening".</p>
            </div>
          )}

          {/* Historical Screening Log */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Recent Image Screenings ({screeningHistory.length})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Plant ID</th>
                    <th className="py-2 px-3">Predicted Condition</th>
                    <th className="py-2 px-3 font-mono">Confidence</th>
                    <th className="py-2 px-3 font-mono">Optical Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {screeningHistory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-mono text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900">{item.plantId}</td>
                      <td className="py-2 px-3">{item.predictedCondition}</td>
                      <td className="py-2 px-3 font-mono font-bold text-indigo-700">
                        {Math.round(item.confidence * 100)}%
                      </td>
                      <td className="py-2 px-3 font-mono text-emerald-700">{item.associatedIndex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AiDiseaseScreeningView;
