import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Droplets, 
  Sprout, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Info, 
  ExternalLink,
  CheckCircle2,
  Stethoscope,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TreatmentAssistanceView = () => {
  const { treatmentKnowledgeBase, plants, setActiveTab } = useApp();

  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState(treatmentKnowledgeBase[0]);

  const filteredTopics = treatmentKnowledgeBase.filter(t => {
    if (selectedCropFilter === 'ALL') return true;
    return t.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Educational & Professional Guidance Disclaimer */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 rounded-2xl p-5 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <BookOpenCheck className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Plant Treatment & Preventive Agronomic Guidance
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Knowledge Base
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              <strong>Agronomic Guidance Protocol:</strong> Recommended interventions are based on peer-reviewed agronomic literature and verified extension manuals (ICAR-IIHR, FAO, CIMMYT). 
              The system provides cultural, irrigation, and nutrient management recommendations. 
              <strong>It does not automatically prescribe synthetic pesticides or unverified chemical dosages from unconfirmed AI predictions.</strong> Always consult local certified extension specialists before field application.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-[11px] shrink-0 space-y-1">
            <div className="text-slate-400 font-sans font-bold text-[10px] uppercase">Knowledge Sources:</div>
            <div className="text-emerald-400 font-bold">ICAR / FAO / Extension</div>
            <div className="text-slate-400 text-[10px]">Verified Agronomic Best-Practices</div>
          </div>
        </div>
      </div>

      {/* Filter and Topic Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Topics List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Crop Categories</span>
              </h3>

              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="ALL">All Crops</option>
                <option value="Tomato">Tomato</option>
                <option value="Wheat">Wheat</option>
                <option value="Pepper">Pepper / Chilli</option>
              </select>
            </div>

            <div className="space-y-2">
              {filteredTopics.map((topic, idx) => {
                const isSelected = selectedTopic.stressType === topic.stressType;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-300 shadow-sm text-emerald-950 font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-slate-900 font-bold">{topic.stressType}</div>
                    <div className="text-[11px] text-slate-500 font-medium italic mt-0.5">{topic.crop}</div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Quick link to Live Sensor */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-emerald-700" />
              <span>Need Live Optical Corroboration?</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Place the affected leaf in the light-sealed chamber to confirm whether mesophyll scattering (850 nm) has declined.
            </p>
            <button
              onClick={() => setActiveTab('live')}
              className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition-colors"
            >
              Open Live Sensing Chamber
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Treatment & Prevention Protocols (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            
            {/* Topic Header */}
            <div className="border-b border-slate-100 pb-4">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {selectedTopic.crop}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                {selectedTopic.stressType}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                <strong>Optical & Foliar Symptoms:</strong> {selectedTopic.symptoms}
              </p>
            </div>

            {/* Possible Causes */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Primary Underlying Physiological Causes
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {selectedTopic.causes}
              </p>
            </div>

            {/* Protocols Grid: Irrigation & Nutrient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Irrigation Guidance */}
              <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-sky-900 font-bold">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Irrigation & Moisture Guidance</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {selectedTopic.irrigationGuidance}
                </p>
              </div>

              {/* Nutrient Guidance */}
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Nutrient & Soil Amendment</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {selectedTopic.nutrientGuidance}
                </p>
              </div>

            </div>

            {/* Preventive Practices */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Long-Term Preventive Cultural Practices</span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {selectedTopic.preventivePractices}
              </p>
            </div>

            {/* Verified Literature References */}
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block text-[11px]">
                  Verified Scientific & Extension References:
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {selectedTopic.sources}
                </span>
              </div>
            </div>

            {/* Agronomist Consultation Note */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span className="italic">BMSCE AgTech Advisory System • Module 8</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Guidance
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default TreatmentAssistanceView;
