import React, { useState } from 'react';
import {
  FileText, Activity, CheckCircle2, AlertTriangle, Clock,
  Calendar, Download, Eye, Sparkles, Droplets, HeartPulse
} from 'lucide-react';

const LAB_BIOMARKERS = [
  {
    name: 'Hemoglobin (Hb)',
    category: 'CBC',
    value: 14.2,
    unit: 'g/dL',
    refRange: '13.0 - 17.0',
    status: 'Normal',
    color: 'emerald',
    percent: 60
  },
  {
    name: 'Total Leukocyte Count (WBC)',
    category: 'CBC',
    value: 7400,
    unit: '/uL',
    refRange: '4,000 - 11,000',
    status: 'Normal',
    color: 'emerald',
    percent: 50
  },
  {
    name: 'Platelet Count',
    category: 'CBC',
    value: 245000,
    unit: '/uL',
    refRange: '150,000 - 450,000',
    status: 'Normal',
    color: 'emerald',
    percent: 45
  },
  {
    name: 'Fasting Blood Glucose',
    category: 'Metabolic',
    value: 95.0,
    unit: 'mg/dL',
    refRange: '70.0 - 100.0',
    status: 'Optimal',
    color: 'emerald',
    percent: 55
  },
  {
    name: 'HbA1c (Glycated Hemoglobin)',
    category: 'Metabolic',
    value: 5.6,
    unit: '%',
    refRange: '< 5.7 (Normal)',
    status: 'Optimal',
    color: 'emerald',
    percent: 48
  },
  {
    name: 'Total Cholesterol',
    category: 'Lipid',
    value: 175.0,
    unit: 'mg/dL',
    refRange: '< 200.0 (Desirable)',
    status: 'Desirable',
    color: 'emerald',
    percent: 62
  },
  {
    name: 'HDL Cholesterol (Good)',
    category: 'Lipid',
    value: 52.0,
    unit: 'mg/dL',
    refRange: '> 40.0 (Optimal)',
    status: 'Optimal',
    color: 'emerald',
    percent: 65
  },
  {
    name: 'LDL Cholesterol (Bad)',
    category: 'Lipid',
    value: 98.0,
    unit: 'mg/dL',
    refRange: '< 100.0 (Optimal)',
    status: 'Optimal',
    color: 'emerald',
    percent: 58
  },
  {
    name: 'Serum Triglycerides',
    category: 'Lipid',
    value: 130.0,
    unit: 'mg/dL',
    refRange: '< 150.0 (Normal)',
    status: 'Normal',
    color: 'emerald',
    percent: 52
  },
  {
    name: 'Serum Creatinine',
    category: 'Renal',
    value: 0.9,
    unit: 'mg/dL',
    refRange: '0.6 - 1.2 (Normal)',
    status: 'Optimal',
    color: 'emerald',
    percent: 45
  },
  {
    name: 'Blood Urea Nitrogen (BUN)',
    category: 'Renal',
    value: 14.0,
    unit: 'mg/dL',
    refRange: '7.0 - 20.0',
    status: 'Normal',
    color: 'emerald',
    percent: 50
  },
  {
    name: 'SGPT / ALT (Liver Enzyme)',
    category: 'Liver',
    value: 24.0,
    unit: 'U/L',
    refRange: '7.0 - 56.0',
    status: 'Normal',
    color: 'emerald',
    percent: 40
  }
];

export default function LabReportsDiagnosticPanel({ patientName = 'Priya Sharma' }) {
  const [selectedCat, setSelectedCat] = useState('all');

  const filteredBiomarkers = selectedCat === 'all'
    ? LAB_BIOMARKERS
    : LAB_BIOMARKERS.filter(b => b.category.toLowerCase() === selectedCat.toLowerCase());

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">Diagnostic Laboratory Biomarkers & Bloodwork</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                NABL Certified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Recent Automated Biochemistry & Hematology Profile for {patientName}</p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCat === 'all' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            All (12)
          </button>
          <button
            onClick={() => setSelectedCat('cbc')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCat === 'cbc' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            CBC
          </button>
          <button
            onClick={() => setSelectedCat('metabolic')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCat === 'metabolic' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Glucose & HbA1c
          </button>
          <button
            onClick={() => setSelectedCat('lipid')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCat === 'lipid' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Lipid Profile
          </button>
          <button
            onClick={() => setSelectedCat('renal')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCat === 'renal' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Kidney & Liver
          </button>
        </div>
      </div>

      {/* Biomarker Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBiomarkers.map((bio, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">{bio.category}</span>
                <h4 className="text-xs font-black text-slate-900 mt-0.5">{bio.name}</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                {bio.status}
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{bio.value}</span>
              <span className="text-xs font-bold text-slate-500">{bio.unit}</span>
            </div>

            {/* Range Meter Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                  style={{ width: `${bio.percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Ref: {bio.refRange}</span>
                <span className="text-emerald-700">In Range</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
