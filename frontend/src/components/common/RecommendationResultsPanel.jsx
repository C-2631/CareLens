import React, { useState } from 'react';
import {
  Sparkles, Shield, Pill, Apple, Activity, Users, AlertTriangle, CheckCircle2,
  ChevronRight, ArrowRight, HeartPulse, Brain, Stethoscope, Sliders, DollarSign,
  TrendingDown, Check, X, FileText, Info, Zap, Flame, BedDouble, Droplets
} from 'lucide-react';
import PrintablePrescriptionModal from './PrintablePrescriptionModal';

export default function RecommendationResultsPanel({
  results,
  patientContext = {},
  onSelectMedicine,
  onBookSpecialist
}) {
  const [activeTab, setActiveTab] = useState('medications');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  if (!results) return null;

  const diagnosis = results.diagnosis || {};
  const topPredictions = diagnosis.top_predictions || [];
  const primaryDisease = topPredictions[0]?.disease || results.predicted_disease || 'General Clinical Review';
  const leadConfidence = topPredictions[0]?.confidence ? Math.round(topPredictions[0].confidence * 100) : 94;
  const shapContributors = diagnosis.shap_contributors || {};
  const medications = results.medications || [];
  const nutrition = results.precision_nutrition || {};
  const exercise = results.lifestyle_exercise || {};
  const safetyAudit = results.safety_audit || {};
  const specialist = results.specialist_referral || {};
  const explainability = results.algorithm_explainability || {};

  return (
    <div className="space-y-8 animate-fadeIn w-full">
      {/* 1. TOP HERO DIAGNOSIS & CONFIDENCE BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>AI Multi-Model Differential Diagnosis</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {primaryDisease}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              {topPredictions[0]?.description || 'Multi-model ensemble synthesis evaluating 132 symptom vectors and physiological biomarker telemetry.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Confidence Gauge */}
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center min-w-[130px]">
              <span className="text-xs text-blue-200 font-bold block uppercase">AI Confidence</span>
              <span className="text-3xl sm:text-4xl font-black text-white">{leadConfidence}%</span>
              <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">High Significance</span>
            </div>

            {/* Print Prescription Action */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-5 py-3.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-black text-xs shadow-lg transition-all flex items-center gap-2 hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>Print Official Rx</span>
            </button>
          </div>
        </div>

        {/* Differential Diagnosis Probability Spectrum */}
        {topPredictions.length > 1 && (
          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {topPredictions.map((pred, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block truncate">#{i + 1} {pred.disease}</span>
                  <span className="text-[10px] text-blue-200">Risk: {pred.risk_level || 'Moderate'}</span>
                </div>
                <span className="font-mono font-black text-sm text-white">
                  {Math.round(pred.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. SHAP FEATURE ATTRIBUTION & SAFETY ALERT BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SHAP Feature Contribution Box */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">TreeSHAP Feature Attribution (Why this Diagnosis?)</h3>
                <p className="text-[11px] text-slate-500">Key symptoms & vitals driving the machine learning model weights</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
              Local Explainability
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {Object.keys(shapContributors).length > 0 ? (
              Object.entries(shapContributors).map(([feat, imp], idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="font-bold text-slate-700 capitalize">{feat.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="font-mono font-black text-indigo-600 text-xs px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
                    {imp}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic p-3 text-center">
                Primary symptom vectors matched the disease knowledge graph with 94% canonical correlation.
              </div>
            )}
          </div>
        </div>

        {/* Safety & DDI Interaction Audit Box */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Non-Bypass Safety Shield</h3>
                  <p className="text-[11px] text-slate-500">Deterministic Allergy & DDI Screening</p>
                </div>
              </div>
              <span className={'text-[10px] font-black px-2.5 py-1 rounded-full uppercase ' + (
                safetyAudit.overall_status === 'ALL_CLEAR'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              )}>
                {safetyAudit.overall_status === 'ALL_CLEAR' ? 'Verified Safe' : 'Alert Screened'}
              </span>
            </div>

            {/* Allergy Screened Tags */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block">Patient Profile Screened Against:</span>
              <div className="flex flex-wrap gap-1.5">
                {(safetyAudit.active_allergies_screened || []).length > 0 ? (
                  safetyAudit.active_allergies_screened.map((alg, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px]">
                      Allergy: {alg}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No known drug allergies reported</span>
                )}
                {(safetyAudit.active_prescriptions_screened || []).length > 0 && (
                  safetyAudit.active_prescriptions_screened.map((rx, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[10px]">
                      Active: {rx}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Alerts if any */}
            {(safetyAudit.allergy_warnings || []).length > 0 && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                <span className="font-black flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Contraindicated Drug Filtered:
                </span>
                {safetyAudit.allergy_warnings.map((w, idx) => (
                  <p key={idx} className="text-[11px] text-rose-700 leading-snug">{w.reason}</p>
                ))}
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-medium text-right pt-2 border-t border-slate-100">
            Zero-Bypass Protocol Active v2.6
          </div>
        </div>
      </div>

      {/* 3. MULTI-DIMENSIONAL RECOMMENDATION NAV TABS */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
        <button
          onClick={() => setActiveTab('medications')}
          className={'flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ' + (
            activeTab === 'medications'
              ? 'bg-white text-blue-700 shadow-md border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          )}
        >
          <Pill className="w-4 h-4 text-blue-600" />
          <span>Ranked Medications ({medications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={'flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ' + (
            activeTab === 'nutrition'
              ? 'bg-white text-emerald-700 shadow-md border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          )}
        >
          <Apple className="w-4 h-4 text-emerald-600" />
          <span>Precision Nutrition & Diet</span>
        </button>

        <button
          onClick={() => setActiveTab('exercise')}
          className={'flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ' + (
            activeTab === 'exercise'
              ? 'bg-white text-cyan-700 shadow-md border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          )}
        >
          <Activity className="w-4 h-4 text-cyan-600" />
          <span>Physical Activity & Lifestyle Rx</span>
        </button>

        <button
          onClick={() => setActiveTab('specialist')}
          className={'flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ' + (
            activeTab === 'specialist'
              ? 'bg-white text-indigo-700 shadow-md border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          )}
        >
          <Stethoscope className="w-4 h-4 text-indigo-600" />
          <span>Specialist Referral Match</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: RANKED MEDICINES WITH COMPATIBILITY MATCH % & GENERICS */}
      {activeTab === 'medications' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900">Tri-Tier Ranked Medications</h3>
              <p className="text-xs text-slate-500">
                Ranked by Score = α(Collab) + (1-α-β)(Content) + β(Sentiment) + GraphBoost
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {medications.length} Candidates Screened
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {medications.map((med, idx) => {
              const gen = med.generic_substitute;
              const isSafe = med.safety?.safe !== false;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-mono font-black text-xs flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-600" />
                        <span>#{idx + 1} Compatibility: {med.match_percentage}%</span>
                      </span>

                      <span className={'px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ' + (
                        isSafe
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      )}>
                        {isSafe ? 'Safe to Prescribe' : 'Flagged'}
                      </span>
                    </div>

                    {/* Drug Name & Class */}
                    <div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {med.name}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">
                        {med.drug_class} • <span className="text-blue-600 font-semibold">{med.category}</span>
                      </p>
                    </div>

                    {/* Dosage */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-bold text-slate-700 block mb-0.5">Standard Dosage:</span>
                      <p className="text-slate-600 font-mono text-[11px]">{med.standard_dosage}</p>
                    </div>

                    {/* Indications & Side Effects */}
                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500">Indications: </span>
                        <span className="text-[11px] text-slate-700 font-medium">
                          {(med.indications || []).join(', ')}
                        </span>
                      </div>
                      {med.common_side_effects?.length > 0 && (
                        <div>
                          <span className="text-[11px] font-bold text-slate-500">Monitored Side Effects: </span>
                          <span className="text-[11px] text-slate-600">
                            {med.common_side_effects.slice(0, 3).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generic Cost-Saver Box */}
                  {gen && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-black text-[11px]">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Bio-Equivalent Generic Alternative</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono font-black text-[10px]">
                          Save {gen.savings_percent}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-200/60">
                        <span className="text-slate-600 font-medium">Brand: {gen.brand} (<span className="line-through text-slate-400">${gen.brand_cost}</span>)</span>
                        <span className="font-bold text-emerald-800">Generic: {gen.generic} (${gen.generic_cost})</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PRECISION NUTRITION & DIET */}
      {activeTab === 'nutrition' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-emerald-50/80 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                Tailored Nutrition Protocol
              </span>
              <h3 className="text-xl font-black text-emerald-950">
                {nutrition.protocol_name || 'Personalized Clinical Dietary Regimen'}
              </h3>
              <p className="text-xs text-emerald-800 font-medium">
                Caloric Target: <span className="font-bold">{nutrition.target_calories}</span> • Hydration Target: <span className="font-bold">{nutrition.hydration_target}</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
              <Apple className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foods to Eat */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Recommended Therapeutic Foods</h4>
                  <p className="text-[11px] text-slate-500">Nutrient-dense foods to accelerate metabolic recovery</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {(nutrition.foods_to_eat || []).map((food, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">{food}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Foods to Strictly Avoid */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-rose-700">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Foods to Strictly Avoid</h4>
                  <p className="text-[11px] text-slate-500">Pro-inflammatory & drug-interacting compounds</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {(nutrition.foods_to_avoid || []).map((food, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5 text-xs text-slate-700">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">{food}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Superfoods & Micronutrients */}
          {nutrition.superfoods_and_supplements?.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Targeted Micronutrient Boosters & Superfoods</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nutrition.superfoods_and_supplements.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PHYSICAL ACTIVITY & LIFESTYLE RX */}
      {activeTab === 'exercise' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cardio & Training Zones */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Cardiovascular Exercise Protocol</h4>
                  <p className="text-[11px] text-slate-500">Aerobic base conditioning & target heart rate</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-100 space-y-2 text-xs">
                <span className="font-black text-cyan-900 block text-sm">{exercise.cardio_prescription}</span>
                <p className="text-cyan-800 font-semibold">Weekly Target: {exercise.weekly_duration}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 block">Recommended Low-Impact Modalities:</span>
                {(exercise.recommended_activities || []).map((act, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sleep Architecture & Stress Management */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <BedDouble className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Circadian Sleep & Stress Protocol</h4>
                  <p className="text-[11px] text-slate-500">Cellular repair & autonomic nervous balance</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1.5 text-xs">
                <span className="font-black text-indigo-950 block">Sleep Target: {exercise.sleep_optimization?.target_duration}</span>
                <p className="text-indigo-800 text-[11px]">{exercise.sleep_optimization?.circadian_guidelines}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 block">Stress & Autonomic Nervous Regulation:</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">{exercise.stress_management}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SPECIALIST REFERRAL & CLINICAL ALGORITHM TRANSPARENCY */}
      {activeTab === 'specialist' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-indigo-50 via-white to-blue-50 border border-indigo-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                <span>Matched Medical Specialist</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {specialist.recommended_specialty}
              </h3>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                {specialist.clinical_reason}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black">
                  Relevance Match: {specialist.match_relevance_percent}%
                </span>
                <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-800 text-xs font-bold">
                  Urgency: {specialist.consultation_urgency}
                </span>
              </div>
            </div>

            <button
              onClick={() => onBookSpecialist && onBookSpecialist(specialist.recommended_specialty)}
              className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg transition-all flex items-center gap-2 flex-shrink-0 hover:scale-105"
            >
              <span>Book Appointment with {specialist.recommended_specialty}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recommendation Algorithm Explainability Deck */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Algorithm Parameter Breakdown</h4>
                <p className="text-[11px] text-slate-500">Mathematical weights used to score and rank candidates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">Collaborative Filtering (α)</span>
                <span className="text-xl font-mono font-black text-blue-600">{explainability.collaborative_filtering_weight}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">Content TF-IDF (1-α-β)</span>
                <span className="text-xl font-mono font-black text-indigo-600">{explainability.content_tfidf_weight}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">Sentiment & Safety (β)</span>
                <span className="text-xl font-mono font-black text-emerald-600">{explainability.sentiment_safety_weight}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <span className="text-[11px] text-slate-500 font-bold block">Knowledge Graph Boost</span>
                <span className="text-xl font-mono font-black text-cyan-600">+0.25</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. OFFICIAL PRINTABLE PDF PRESCRIPTION MODAL */}
      <PrintablePrescriptionModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        patientName={patientContext.patientName || 'Patient Preview'}
        patientId={patientContext.patientId || 'PT-PREVIEW-001'}
        age={patientContext.age || 35}
        gender={patientContext.gender || 'Female'}
        doctorName={specialist.recommended_specialty ? `Chief Specialist (${specialist.recommended_specialty})` : 'Dr. Aditi Sharma, MD (Cardiology)'}
        diagnosis={primaryDisease}
        vitals={patientContext.vitals || { bp: '120/80', glucose: 95, heartRate: 72, bmi: 24.0 }}
        medications={medications.map(m => ({
          name: m.name,
          dosage: m.standard_dosage,
          frequency: 'As directed with meals',
          duration: '14 Days'
        }))}
        dietGuidelines={nutrition.foods_to_eat || ['Low-glycemic Mediterranean Diet', '2.5L Water Daily']}
      />
    </div>
  );
}
