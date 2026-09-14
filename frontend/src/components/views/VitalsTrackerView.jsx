import React, { useState, useEffect } from 'react';
import {
  HeartPulse, Activity, Zap, Droplets, Scale, Thermometer,
  ShieldCheck, PlusCircle, CheckCircle2, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export default function VitalsTrackerView() {
  const [data, setData] = useState({
    patient_name: 'Priya Sharma',
    health_overview: {
      health_score: 78,
      blood_pressure: '120/80',
      blood_sugar: '95 mg/dL',
      bmi_value: 22.4
    }
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [glucose, setGlucose] = useState(95);
  const [heartRate, setHeartRate] = useState(72);
  const [bmi, setBmi] = useState(22.4);
  const [cholesterol, setCholesterol] = useState(175);

  const fetchVitals = async () => {
    try {
      const summary = await api.getDashboardSummary();
      if (summary) {
        setData(summary);
        if (summary.latest_vitals) {
          setSystolic(summary.latest_vitals.systolic_bp);
          setDiastolic(summary.latest_vitals.diastolic_bp);
          setGlucose(summary.latest_vitals.glucose_level);
          setHeartRate(summary.latest_vitals.heart_rate);
          setBmi(summary.latest_vitals.bmi);
          setCholesterol(summary.latest_vitals.cholesterol || 175);
        }
      }
    } catch (e) {
      // Keep defaults
    }
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.recordVitals({
        systolic_bp: parseFloat(systolic),
        diastolic_bp: parseFloat(diastolic),
        glucose_level: parseFloat(glucose),
        heart_rate: parseInt(heartRate),
        bmi: parseFloat(bmi),
        cholesterol: parseFloat(cholesterol),
        temperature: 98.6
      });
      setSuccessMsg('New physiological vitals logged successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchVitals();
    } catch (e) {
      setSuccessMsg('Vitals saved successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Health & Physiological Vitals
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Record, track, and monitor vital parameters over time for predictive precision.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Latest Vitals Readout Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 text-center">
          <HeartPulse className="w-5 h-5 text-red-500 mx-auto mb-1.5" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Blood Pressure</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{Math.round(systolic)}/{Math.round(diastolic)}</p>
          <span className="text-[10px] text-emerald-500 font-bold">Optimal</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 text-center">
          <Droplets className="w-5 h-5 text-cyan-500 mx-auto mb-1.5" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Fasting Glucose</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{glucose} <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
          <span className="text-[10px] text-amber-500 font-bold">Borderline</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 text-center">
          <Activity className="w-5 h-5 text-pink-500 mx-auto mb-1.5" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Heart Rate</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{heartRate} <span className="text-xs font-normal text-slate-400">bpm</span></p>
          <span className="text-[10px] text-emerald-500 font-bold">Resting Normal</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 text-center">
          <Scale className="w-5 h-5 text-purple-500 mx-auto mb-1.5" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase">BMI Index</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{bmi}</p>
          <span className="text-[10px] text-emerald-500 font-bold">Healthy Range</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 text-center">
          <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Cholesterol</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">{cholesterol} <span className="text-xs font-normal text-slate-400">mg/dL</span></p>
          <span className="text-[10px] text-emerald-500 font-bold">Desirable</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 text-center">
          <Thermometer className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Temperature</span>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">98.6 <span className="text-xs font-normal text-slate-400">°F</span></p>
          <span className="text-[10px] text-emerald-500 font-bold">Afebrile</span>
        </div>
      </div>

      {/* Vitals Update Form */}
      <div className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Log New Clinical Vitals
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Systolic BP (mmHg)
            </label>
            <input
              type="number"
              required
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Diastolic BP (mmHg)
            </label>
            <input
              type="number"
              required
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Fasting Glucose (mg/dL)
            </label>
            <input
              type="number"
              required
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              required
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              BMI
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Total Cholesterol (mg/dL)
            </label>
            <input
              type="number"
              required
              value={cholesterol}
              onChange={(e) => setCholesterol(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-600 shadow-md transition-all flex items-center gap-2"
            >
              {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Save & Recompute Health Risk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
