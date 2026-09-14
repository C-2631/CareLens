import React, { useState, useEffect } from 'react';
import {
  Sparkles, Search, CheckCircle2, AlertCircle, ArrowRight,
  Activity, ShieldCheck, RefreshCw, X, Pill, HeartPulse, ChevronDown
} from 'lucide-react';
import HologramAvatar from '../3d/HologramAvatar';
import { api } from '../../services/api';

export default function SymptomCheckerModalView({ onNavigateToRecos }) {
  const [symptomsList, setSymptomsList] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['fatigue', 'excessive_hunger', 'polyuria']);
  const [searchTerm, setSearchTerm] = useState('');
  const [vitals, setVitals] = useState({
    systolic_bp: 138,
    diastolic_bp: 86,
    glucose_level: 154,
    heart_rate: 76,
    bmi: 27.2
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSymptoms = async () => {
      const res = await api.getSymptomsList();
      if (res.symptoms?.length > 0) {
        setSymptomsList(res.symptoms);
      } else {
        // Fallback common symptom items
        setSymptomsList([
          { id: 'fatigue', label: 'Fatigue' },
          { id: 'excessive_hunger', label: 'Excessive Hunger' },
          { id: 'polyuria', label: 'Frequent Urination (Polyuria)' },
          { id: 'headache', label: 'Headache' },
          { id: 'dizziness', label: 'Dizziness' },
          { id: 'chest_pain', label: 'Chest Pain' },
          { id: 'breathlessness', label: 'Breathlessness' },
          { id: 'joint_pain', label: 'Joint Pain' },
          { id: 'skin_rash', label: 'Skin Rash' },
          { id: 'cough', label: 'Cough' },
          { id: 'high_fever', label: 'High Fever' },
          { id: 'blurred_and_distorted_vision', label: 'Blurred Vision' },
          { id: 'acidity', label: 'Acidity' },
          { id: 'vomiting', label: 'Vomiting' },
          { id: 'sweating', label: 'Sweating' }
        ]);
      }
    };
    fetchSymptoms();
  }, []);

  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    const result = await api.predictDisease({
      symptoms: selectedSymptoms,
      vitals: vitals
    });
    setPredictionResult(result);
    setLoading(false);
  };

  const filteredSymptoms = symptomsList.filter(s =>
    s.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Top Banner (Matching panel 5 of reference image: "MediSuggest") */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1630] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden text-white">
        {/* Glowing Background Radial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              MediSuggest AI Diagnostic Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Smarter Recommendations. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Healthier You.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
              MediSuggest uses AI and machine learning to provide personalized medicine, lifestyle and wellness recommendations based on your unique health profile.
            </p>

            {/* Feature Floating Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-cyan-500/30 text-xs">
                <span className="font-bold text-cyan-300 block">Disease Prediction</span>
                <span className="text-[10px] text-slate-400">AI Analysis</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-blue-500/30 text-xs">
                <span className="font-bold text-blue-300 block">Medicine Suggestion</span>
                <span className="text-[10px] text-slate-400">Personalized</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-emerald-500/30 text-xs">
                <span className="font-bold text-emerald-300 block">Health Insights</span>
                <span className="text-[10px] text-slate-400">Better Decisions</span>
              </div>
            </div>
          </div>

          {/* Right Hologram Visual */}
          <div className="lg:col-span-6">
            <HologramAvatar
              organStatuses={{
                heart: 'Normal',
                lungs: 'Normal',
                liver: 'Normal',
                kidneys: 'Normal',
                metabolism: 'Needs Attention'
              }}
              interactive={true}
            />
          </div>
        </div>
      </div>

      {/* Interactive Symptom Selector & Vitals Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Symptom Selector from 132 Symptoms (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Select Active Symptoms
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose from 132 clinical symptom tags or search
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full">
              {selectedSymptoms.length} Selected
            </span>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search symptom (e.g. thirst, fatigue, headache, cough)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Selected Badges */}
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 p-3 rounded-xl bg-blue-50/60 dark:bg-slate-800/40 border border-blue-200/60 dark:border-slate-700/60">
              {selectedSymptoms.map((sym) => (
                <span
                  key={sym}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600 dark:bg-cyan-500 text-white shadow-sm"
                >
                  <span className="capitalize">{sym.replace(/_/g, ' ')}</span>
                  <button
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className="hover:opacity-80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Symptom Tag Cloud */}
          <div className="h-48 overflow-y-auto pr-1 flex flex-wrap gap-1.5 scrollbar-thin">
            {filteredSymptoms.slice(0, 45).map((s) => {
              const isSelected = selectedSymptoms.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSymptom(s.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 dark:bg-cyan-500 text-white font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Vitals Sliders & Inference Trigger (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Physiological Vitals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Calibrates machine learning multi-label risk stratification
            </p>

            {/* Sliders */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Systolic Blood Pressure</span>
                  <span className="text-cyan-500 font-bold">{vitals.systolic_bp} mmHg</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="190"
                  value={vitals.systolic_bp}
                  onChange={(e) => setVitals({ ...vitals, systolic_bp: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Fasting Glucose Level</span>
                  <span className="text-cyan-500 font-bold">{vitals.glucose_level} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="280"
                  value={vitals.glucose_level}
                  onChange={(e) => setVitals({ ...vitals, glucose_level: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Resting Heart Rate</span>
                  <span className="text-cyan-500 font-bold">{vitals.heart_rate} bpm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="130"
                  value={vitals.heart_rate}
                  onChange={(e) => setVitals({ ...vitals, heart_rate: parseInt(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Body Mass Index (BMI)</span>
                  <span className="text-cyan-500 font-bold">{vitals.bmi}</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="45"
                  step="0.1"
                  value={vitals.bmi}
                  onChange={(e) => setVitals({ ...vitals, bmi: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading || selectedSymptoms.length === 0}
            className="w-full mt-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Inference Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Diagnostic Prediction</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prediction Output Results Card */}
      {predictionResult && (
        <div className="p-6 rounded-3xl glass-card border border-cyan-500/40 shadow-2xl animate-fadeIn space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Model Inference Completed Successfully</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Identified Condition: {predictionResult.top_predictions[0]?.disease}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/30">
                {Math.round(predictionResult.lead_confidence * 100)}% Confidence
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Specialist: {predictionResult.recommended_specialist}
              </span>
            </div>
          </div>

          {/* TreeSHAP Feature Attributions Bar */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              TreeSHAP Feature Attributions (Local Explainability)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(predictionResult.shap_top_contributors || {}).map(([feature, impact], i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 block truncate capitalize">
                    {feature.replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    {impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row to Generate Recommendations */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {predictionResult.disclaimer}
            </p>

            <button
              onClick={() => onNavigateToRecos(predictionResult.top_predictions[0]?.disease)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-600 shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              <span>Explore Medications & Diet Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
