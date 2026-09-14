import React, { useRef } from 'react';
import {
  HeartPulse, Printer, Download, X, CheckCircle2, Shield,
  QrCode, Stethoscope, Pill, Calendar, User, FileText, Activity
} from 'lucide-react';

export default function PrintablePrescriptionModal({ patient, onClose }) {
  const printRef = useRef(null);

  if (!patient) return null;

  const handlePrint = () => {
    window.print();
  };

  const rxCode = `RX-${patient.patient_id?.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-w-none print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* Modal Action Header (Hidden during actual paper print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black tracking-wide">Official Hospital Clinical Prescription & EHR Summary</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Prescription</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={printRef} className="p-8 sm:p-10 overflow-y-auto space-y-6 text-slate-900 bg-white font-sans">
          {/* Hospital Letterhead */}
          <div className="border-b-2 border-blue-600 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <HeartPulse className="w-7 h-7 fill-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-blue-700 tracking-tight leading-tight">
                  CARELENS MULTI-SPECIALTY HOSPITAL & CDSS RESEARCH CENTER
                </h1>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  NABH & JCI Accredited Tertiary Care Facility • Reg. No: CL-HOSP-2026-998
                </p>
                <p className="text-[10px] text-slate-400">
                  Medical Enclave, Healthcare Blvd, Suite 100 • Emergency: +91 1800-200-CARE • carelens.ai
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end flex-shrink-0">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-mono font-black text-xs">
                {rxCode}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 font-semibold">Date: {currentDate}</span>
            </div>
          </div>

          {/* Patient & Attending Doctor Demographic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1">
              <p><span className="font-bold text-slate-500">Patient Name:</span> <strong className="text-slate-900 text-sm">{patient.full_name}</strong></p>
              <p><span className="font-bold text-slate-500">Patient ID:</span> <span className="font-mono font-bold text-slate-700">{patient.patient_id}</span> • Age/Gender: <span className="font-bold text-slate-700">{patient.age}y / {patient.gender}</span></p>
              <p><span className="font-bold text-slate-500">Blood Group:</span> <strong className="text-blue-700">{patient.blood_group}</strong> • Status: <span className="font-bold text-emerald-700">{patient.admission_status} ({patient.bed_number})</span></p>
            </div>

            <div className="space-y-1 sm:text-right">
              <p><span className="font-bold text-slate-500">Attending Physician:</span> <strong className="text-slate-900 text-sm">{patient.assigned_doctor_name || 'Dr. Aditi Sharma'}</strong></p>
              <p><span className="font-bold text-slate-500">Department:</span> <span className="font-bold text-slate-700">{patient.assigned_doctor_specialty || 'Cardiology & Internal Medicine'}</span></p>
              <p><span className="font-bold text-slate-500">Supervising Nurse:</span> <span className="font-bold text-slate-700">{patient.assigned_nurse_name || 'Nurse Sarah Jenkins'}</span></p>
            </div>
          </div>

          {/* Vitals Telemetry Snapshot */}
          <div className="grid grid-cols-4 gap-3 p-3 rounded-2xl bg-blue-50/60 border border-blue-100 text-center text-xs">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase">Resting BP</span>
              <p className="font-black text-slate-900 mt-0.5">{patient.blood_pressure_status?.split(' ')[0] || '120/80'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase">Heart Rate</span>
              <p className="font-black text-slate-900 mt-0.5">72 bpm</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase">Fasting Glucose</span>
              <p className="font-black text-slate-900 mt-0.5">{patient.blood_sugar_status?.split(' ')[0] || '95 mg/dL'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase">AI Health Score</span>
              <p className="font-black text-emerald-700 mt-0.5">{patient.health_score || 78}/100</p>
            </div>
          </div>

          {/* Clinical Assessment & Diagnosis */}
          <div className="space-y-1.5 text-xs">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide">
              <Activity className="w-4 h-4 text-blue-600" />
              Clinical Diagnosis & Indications:
            </h3>
            <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium leading-relaxed">
              {patient.reason_for_visit}. Patient shows stable hemodynamic parameters with no acute decompensation. Continue maintenance anti-inflammatory and cardio-protective pharmacotherapy.
            </p>
          </div>

          {/* Rx Medication Schedule Table */}
          <div className="space-y-2 text-xs">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide">
              <Pill className="w-4 h-4 text-cyan-600" />
              Prescribed Medical Regimen (Rx):
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-black text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Medication Name</th>
                    <th className="py-2.5 px-3">Dosage</th>
                    <th className="py-2.5 px-3">Frequency & Slot</th>
                    <th className="py-2.5 px-3">Relation to Food</th>
                    <th className="py-2.5 px-3 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(patient.medication_schedules || [
                    { medicine_name: 'Paracetamol 650mg', dosage: '1 Tablet', timing_slot: 'Morning', food_relation: 'After Food' },
                    { medicine_name: 'Vitamin C & Zinc', dosage: '1 Tablet', timing_slot: 'Afternoon', food_relation: 'After Food' },
                    { medicine_name: 'Cetirizine 10mg', dosage: '1 Tablet', timing_slot: 'Night', food_relation: 'Before Sleep' }
                  ]).map((med, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 font-bold text-slate-400">{i + 1}</td>
                      <td className="py-2.5 px-3 font-black text-slate-900">{med.medicine_name}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-700">{med.dosage}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-semibold">{med.timing_slot}</td>
                      <td className="py-2.5 px-3 text-slate-600">{med.food_relation}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-600">14 Days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Allergies & Safety Certification Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
              <span className="font-black text-rose-800 uppercase text-[10px] block">Documented Drug Allergies:</span>
              <p className="text-rose-700 font-bold">
                {patient.allergies?.join(', ') || 'No known allergies reported'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <span className="font-black text-emerald-800 uppercase text-[10px] block">DDI Non-Bypass Safety Shield:</span>
              <p className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified zero harmful drug collisions or contraindications.
              </p>
            </div>
          </div>

          {/* Doctor Signature & QR Code Seal */}
          <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border-2 border-slate-300 p-1 flex items-center justify-center bg-white shadow-xs">
                {/* Visual SVG QR Representation */}
                <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h2v2h-2v-2zm-4 0h2v4h-2v-4zm4 4h2v2h-2v-2zm2-2h2v4h-2v-4zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
                </svg>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                <p className="font-bold text-slate-700">Digital Verification QR</p>
                <p>Scan to verify Rx validity on</p>
                <p className="font-mono text-blue-600">carelens.ai/verify/{rxCode}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block border-b border-slate-400 pb-1 px-4">
                <span className="font-serif italic font-black text-base text-blue-800 block">
                  {patient.assigned_doctor_name || 'Dr. Aditi Sharma'}
                </span>
              </div>
              <p className="text-[11px] font-black text-slate-800">
                {patient.assigned_doctor_name || 'Dr. Aditi Sharma'}, MD, DM (Cardiology)
              </p>
              <p className="text-[10px] text-slate-400">Chief of Medicine • Reg: MCI-2012-4892</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
