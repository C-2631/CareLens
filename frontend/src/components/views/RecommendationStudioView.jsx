import React, { useState, useEffect } from 'react';
import {
  Sparkles, Sliders, Activity, Pill, Shield, Brain, RefreshCw, Check,
  AlertCircle, ChevronRight, Zap, Play, Filter, Plus, X, Search, Info, RotateCcw
} from 'lucide-react';
import RecommendationResultsPanel from '../common/RecommendationResultsPanel';
import { recommendApi } from '../../services/api';

const ORGAN_SYSTEM_CATEGORIES = {
  'Cardiovascular': ['chest_pain', 'palpitations', 'fast_heart_rate', 'breathlessness', 'sweating', 'dizziness', 'swollen_legs', 'prominent_veins_on_calf'],
  'Endocrine & Metabolic': ['irregular_sugar_level', 'excessive_hunger', 'polyuria', 'fatigue', 'weight_loss', 'weight_gain', 'obesity', 'lethargy', 'enlarged_thyroid', 'brittle_nails'],
  'Gastrointestinal': ['stomach_pain', 'acidity', 'ulcers_on_tongue', 'vomiting', 'indigestion', 'nausea', 'loss_of_appetite', 'abdominal_pain', 'diarrhoea', 'constipation', 'passage_of_gases', 'yellowish_skin', 'dark_urine', 'yellowing_of_eyes'],
  'Respiratory': ['cough', 'breathlessness', 'continuous_sneezing', 'phlegm', 'throat_irritation', 'sinus_pressure', 'runny_nose', 'congestion', 'mucoid_sputum', 'blood_in_sputum'],
  'Neurological': ['headache', 'dizziness', 'spinning_movements', 'loss_of_balance', 'unsteadiness', 'slurred_speech', 'weakness_of_one_body_side', 'altered_sensorium', 'lack_of_concentration', 'anxiety', 'depression'],
  'Musculoskeletal': ['joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints', 'movement_stiffness', 'knee_pain', 'hip_joint_pain', 'back_pain', 'muscle_pain', 'cramps', 'painful_walking'],
  'Dermatological': ['itching', 'skin_rash', 'nodal_skin_eruptions', 'dischromic_patches', 'pus_filled_pimples', 'blackheads', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'blister'],
  'General & Immune': ['high_fever', 'mild_fever', 'chills', 'shivering', 'malaise', 'swelled_lymph_nodes', 'dehydration', 'cold_hands_and_feets']
};

const COMMON_ALLERGIES = ['Penicillin', 'Amoxicillin', 'Sulfa Drugs', 'Aspirin', 'Ibuprofen (NSAIDs)', 'Statins', 'Shellfish', 'Pollen & Dust'];
const COMMON_ACTIVE_MEDS = ['Amlodipine Besylate', 'Metformin HCl', 'Atorvastatin Calcium', 'Warfarin Sodium', 'Lisinopril', 'Omeprazole', 'Salbutamol Inhaler'];

export default function RecommendationStudioView({ onOpenBooking }) {
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState(null);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState('Cardiovascular');
  const [symptomSearch, setSymptomSearch] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['fatigue', 'irregular_sugar_level', 'polyuria']);
  const [vitals, setVitals] = useState({
    systolic_bp: 145,
    diastolic_bp: 90,
    glucose_level: 185,
    heart_rate: 78,
    temperature: 98.6,
    bmi: 28.5
  });
  const [patientContext, setPatientContext] = useState({
    name: 'Robert Davis',
    age: 54,
    gender: 'Male',
    patientId: 'PT-DEMO-001'
  });
  const [allergies, setAllergies] = useState(['Penicillin']);
  const [activePrescriptions, setActivePrescriptions] = useState(['Amlodipine Besylate']);
  const [alphaCollab, setAlphaCollab] = useState(0.40);
  const [betaSentiment, setBetaSentiment] = useState(0.15);

  // Result State
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  // Fetch presets on load
  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/recommend/presets');
      if (res.ok) {
        const data = await res.json();
        setPresets(data.presets || []);
      }
    } catch (e) {
      console.warn('Presets fallback');
    }
  };

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setSelectedSymptoms(preset.symptoms || []);
    setVitals(preset.vitals || vitals);
    setPatientContext({
      name: preset.patient?.name || 'Patient',
      age: preset.patient?.age || 45,
      gender: preset.patient?.gender || 'Male',
      patientId: 'PT-' + (preset.id ? preset.id.toUpperCase() : 'DEMO')
    });
    setAllergies(preset.allergies || []);
    setActivePrescriptions(preset.active_prescriptions || []);
  };

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const toggleAllergy = (alg) => {
    if (allergies.includes(alg)) {
      setAllergies(allergies.filter(a => a !== alg));
    } else {
      setAllergies([...allergies, alg]);
    }
  };

  const toggleMedication = (med) => {
    if (activePrescriptions.includes(med)) {
      setActivePrescriptions(activePrescriptions.filter(m => m !== med));
    } else {
      setActivePrescriptions([...activePrescriptions, med]);
    }
  };

  const runRecommendationPipeline = async () => {
    setLoading(true);
    setHasRun(true);
    try {
      const payload = {
        symptoms: selectedSymptoms,
        vitals: vitals,
        patient_allergies: allergies,
        active_prescriptions: activePrescriptions,
        patient_conditions: [],
        age: patientContext.age,
        gender: patientContext.gender,
        alpha_collaborative: alphaCollab,
        beta_sentiment: betaSentiment
      };

      const res = await fetch('http://127.0.0.1:8000/recommend/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        // Fallback simulate
        const simRes = await fetch('http://127.0.0.1:8000/recommend/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const simData = await simRes.json();
        setResults(simData);
      }
    } catch (err) {
      console.error('Studio recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first load if no results yet
  useEffect(() => {
    if (!results && !hasRun) {
      runRecommendationPipeline();
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 w-full">
      {/* 1. STUDIO HEADER */}
      <div className="bg-white border-b border-slate-200 py-10 px-6 sm:px-10 lg:px-16 2xl:px-24">
        <div className="w-full max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-ML Precision Recommendation Studio & CDSS Engine</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Personalized Healthcare Recommendation Studio
              </h1>
              <p className="text-sm text-slate-600 font-medium max-w-3xl mt-1 leading-relaxed">
                Input dynamic clinical symptoms, live physiological vitals, and existing prescriptions to run our multi-model classifier and tri-tier hybrid recommendation pipeline with non-bypass safety shields.
              </p>
            </div>

            <button
              onClick={runRecommendationPipeline}
              disabled={loading || selectedSymptoms.length === 0}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 flex-shrink-0 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Computing AI Models...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white" />
                  <span>Generate AI Recommendations</span>
                </>
              )}
            </button>
          </div>

          {/* 2. ONE-CLICK CLINICAL TEST PRESETS */}
          {presets.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>Quick Clinical Test Presets (1-Click Load):</span>
                </span>
                <span className="text-[11px] text-slate-400">Click any case to populate inputs</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {presets.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={'px-3.5 py-2 rounded-xl text-xs font-bold transition-all border text-left ' + (
                      selectedPresetId === p.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-blue-300'
                    )}
                  >
                    <span className="font-black block">{p.title}</span>
                    <span className={'text-[10px] block opacity-80 ' + (selectedPresetId === p.id ? 'text-blue-100' : 'text-slate-500')}>
                      {p.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. MAIN INPUT STUDIO & RESULTS SECTION */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT 5 COLS: CLINICAL SYMPTOM SELECTOR & BIOMARKER INPUT DECK */}
          <div className="lg:col-span-5 space-y-6">
            {/* Symptom Selector Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">132-Symptom Clinical Matrix</h3>
                    <p className="text-[11px] text-slate-500">Selected: {selectedSymptoms.length} active symptoms</p>
                  </div>
                </div>
                {selectedSymptoms.length > 0 && (
                  <button
                    onClick={() => setSelectedSymptoms([])}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-800"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Selected Symptoms Chips */}
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 min-h-[50px]">
                {selectedSymptoms.length === 0 ? (
                  <span className="text-xs text-slate-400 italic my-auto">No symptoms selected. Click tags below to add.</span>
                ) : (
                  selectedSymptoms.map(sym => (
                    <span
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer hover:bg-rose-600 transition-all shadow-xs"
                    >
                      <span>{sym.replace(/_/g, ' ')}</span>
                      <X className="w-3 h-3" />
                    </span>
                  ))
                )}
              </div>

              {/* Organ Category Tabs */}
              <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-2">
                {Object.keys(ORGAN_SYSTEM_CATEGORIES).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ' + (
                      selectedCategory === cat
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-500 hover:text-slate-900'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Category Symptoms Grid */}
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {ORGAN_SYSTEM_CATEGORIES[selectedCategory]?.map(sym => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      onClick={() => toggleSymptom(sym)}
                      className={'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ' + (
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      )}
                    >
                      {sym.replace(/_/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Physiological Biomarkers Deck */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Physiological Biomarkers Telemetry</h3>
                  <p className="text-[11px] text-slate-500">Adjust sliders to simulate vitals impact</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Systolic BP Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-600">Systolic BP:</span>
                    <span className="font-mono font-black text-blue-600">{vitals.systolic_bp} mmHg</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="210"
                    value={vitals.systolic_bp}
                    onChange={(e) => setVitals({ ...vitals, systolic_bp: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Blood Glucose Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-600">Fasting Blood Glucose:</span>
                    <span className="font-mono font-black text-cyan-600">{vitals.glucose_level} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="320"
                    value={vitals.glucose_level}
                    onChange={(e) => setVitals({ ...vitals, glucose_level: Number(e.target.value) })}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                </div>

                {/* Heart Rate Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-600">Heart Rate:</span>
                    <span className="font-mono font-black text-emerald-600">{vitals.heart_rate} BPM</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="160"
                    value={vitals.heart_rate}
                    onChange={(e) => setVitals({ ...vitals, heart_rate: Number(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* BMI Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-600">Body Mass Index (BMI):</span>
                    <span className="font-mono font-black text-indigo-600">{vitals.bmi} kg/m²</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="45"
                    step="0.5"
                    value={vitals.bmi}
                    onChange={(e) => setVitals({ ...vitals, bmi: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Allergies & Active Prescriptions Multi-Select for Safety Shield Testing */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Safety Profile & Drug Conflicts</h3>
                  <p className="text-[11px] text-slate-500">Select to test non-bypass DDI safety engine</p>
                </div>
              </div>

              {/* Known Allergies */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">Patient Known Allergies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_ALLERGIES.map(alg => {
                    const isSelected = allergies.includes(alg);
                    return (
                      <button
                        key={alg}
                        onClick={() => toggleAllergy(alg)}
                        className={'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ' + (
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-rose-300'
                        )}
                      >
                        {alg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Prescriptions */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 block">Active Current Medications (DDI Cross-Matching):</span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_ACTIVE_MEDS.map(med => {
                    const isSelected = activePrescriptions.includes(med);
                    return (
                      <button
                        key={med}
                        onClick={() => toggleMedication(med)}
                        className={'px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ' + (
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
                        )}
                      >
                        {med}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Algorithm Hyperparameter Weights Slider */}
            <div className="p-5 rounded-3xl bg-slate-100 border border-slate-200 space-y-3 text-xs">
              <span className="font-black text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Recommendation Model Hyperparameters</span>
              </span>
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-[11px]">
                  <span className="text-slate-600">Collaborative Filtering (α): {alphaCollab}</span>
                  <span className="text-slate-600">Content Similarity: {Math.max(0, (1 - alphaCollab - betaSentiment).toFixed(2))}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.70"
                  step="0.05"
                  value={alphaCollab}
                  onChange={(e) => setAlphaCollab(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS: COMPREHENSIVE 5-DIMENSIONAL RESULTS DISPLAY */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4 text-center min-h-[500px]">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Executing AI Recommendation Pipeline...</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Evaluating Random Forest + XGBoost models, traversing NetworkX Knowledge Graph, and screening against 104 medicines.
                  </p>
                </div>
              </div>
            ) : results ? (
              <RecommendationResultsPanel
                results={results}
                patientContext={patientContext}
                onBookSpecialist={(spec) => onOpenBooking && onOpenBooking(spec)}
              />
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4 text-center min-h-[500px]">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Ready to Compute Recommendations</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Select your symptoms and vitals on the left, then click "Generate AI Recommendations".
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
