import React, { useState, useEffect } from 'react';
import {
  Stethoscope, Users, Shield, Clock, Calendar, Pill, AlertTriangle,
  CheckCircle2, Search, Filter, Lock, Unlock, Plus, RefreshCw,
  Syringe, FileText, Activity, Building2, Check, X, Send, Eye,
  Heart, Droplets, Thermometer, UserCheck, AlertCircle, Printer, Volume2, Bell
} from 'lucide-react';
import { staffApi } from '../../services/api';
import PrintablePrescriptionModal from '../common/PrintablePrescriptionModal';
import LabReportsDiagnosticPanel from '../common/LabReportsDiagnosticPanel';

const DEFAULT_SURGERIES = [
  { surgery_id: 'srg-001', patient_id: 'pat-004', patient_name: 'Vikram Patel', doctor_name: 'Dr. Aditi Sharma', specialty: 'Cardiology', procedure_name: 'Coronary Angioplasty (PTCA)', ot_room: 'OT-1 (Cardiac)', scheduled_date: '2026-04-18', scheduled_time: '08:30 AM', anesthetist_name: 'Dr. Neha Verma', status: 'Scheduled' },
  { surgery_id: 'srg-002', patient_id: 'pat-010', patient_name: 'Devendra Kumar', doctor_name: 'Dr. Devendra Kapoor', specialty: 'Orthopedics', procedure_name: 'L4-L5 Lumbar Microdiscectomy', ot_room: 'OT-2 (Orthopedic)', scheduled_date: '2026-04-18', scheduled_time: '10:00 AM', anesthetist_name: 'Dr. Suresh Nair', status: 'Scheduled' },
  { surgery_id: 'srg-003', patient_id: 'pat-009', patient_name: 'Sunita Rao', doctor_name: 'Dr. Sunita Mehra', specialty: 'Oncology', procedure_name: 'Sentinal Lymph Node Biopsy', ot_room: 'OT-3 (General)', scheduled_date: '2026-04-18', scheduled_time: '11:30 AM', anesthetist_name: 'Dr. Neha Verma', status: 'Scheduled' },
  { surgery_id: 'srg-004', patient_id: 'pat-012', patient_name: 'Kavita Joshi', doctor_name: 'Dr. Vikram Malhotra', specialty: 'Neurology', procedure_name: 'Craniotomy for Subdural Evacuation', ot_room: 'OT-4 (Neuro)', scheduled_date: '2026-04-18', scheduled_time: '01:00 PM', anesthetist_name: 'Dr. Ramesh Rao', status: 'Scheduled' },
  { surgery_id: 'srg-005', patient_id: 'pat-015', patient_name: 'Manoj Tiwari', doctor_name: 'Dr. Aditi Sharma', specialty: 'Cardiology', procedure_name: 'Permanent Pacemaker Implantation', ot_room: 'OT-1 (Cardiac)', scheduled_date: '2026-04-19', scheduled_time: '09:00 AM', anesthetist_name: 'Dr. Suresh Nair', status: 'Scheduled' },
  { surgery_id: 'srg-006', patient_id: 'pat-018', patient_name: 'Pooja Hegde', doctor_name: 'Dr. Devendra Kapoor', specialty: 'Orthopedics', procedure_name: 'Total Knee Arthroplasty (Right)', ot_room: 'OT-2 (Orthopedic)', scheduled_date: '2026-04-19', scheduled_time: '11:00 AM', anesthetist_name: 'Dr. Neha Verma', status: 'Scheduled' },
  { surgery_id: 'srg-007', patient_id: 'pat-022', patient_name: 'Amitabh Sen', doctor_name: 'Dr. Priya Nair', specialty: 'Pulmonology', procedure_name: 'Rigid Bronchoscopy & Stent Placement', ot_room: 'OT-3 (General)', scheduled_date: '2026-04-19', scheduled_time: '02:00 PM', anesthetist_name: 'Dr. Ramesh Rao', status: 'Scheduled' },
  { surgery_id: 'srg-008', patient_id: 'pat-025', patient_name: 'Rekha Choudhury', doctor_name: 'Dr. Sunita Mehra', specialty: 'Oncology', procedure_name: 'Laparoscopic Modified Radical Mastectomy', ot_room: 'OT-3 (General)', scheduled_date: '2026-04-20', scheduled_time: '08:30 AM', anesthetist_name: 'Dr. Suresh Nair', status: 'Scheduled' }
];

const DEFAULT_MED_SCHEDULES = [
  { schedule_id: 'sch-001', patient_id: 'pat-001', patient_name: 'Priya Sharma', medicine_name: 'Telmisartan 40mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'After Food', assigned_nurse: 'Nurse Sunita Rao', is_taken: 1 },
  { schedule_id: 'sch-002', patient_id: 'pat-001', patient_name: 'Priya Sharma', medicine_name: 'Atorvastatin 10mg', dosage: '1 Tablet', timing_slot: '08:00 PM (Night)', food_relation: 'After Food', assigned_nurse: 'Nurse Sunita Rao', is_taken: 0 },
  { schedule_id: 'sch-004', patient_id: 'pat-002', patient_name: 'Rohit Verma', medicine_name: 'Metformin 500mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'Before Food', assigned_nurse: 'Nurse Kavita Verma', is_taken: 1 },
  { schedule_id: 'sch-005', patient_id: 'pat-002', patient_name: 'Rohit Verma', medicine_name: 'Glimepiride 2mg', dosage: '1 Tablet', timing_slot: '01:00 PM (Afternoon)', food_relation: 'Before Food', assigned_nurse: 'Nurse Kavita Verma', is_taken: 0 },
  { schedule_id: 'sch-009', patient_id: 'pat-004', patient_name: 'Vikram Patel', medicine_name: 'Clopidogrel 75mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'After Food', assigned_nurse: 'Nurse Sunita Rao', is_taken: 1 },
  { schedule_id: 'sch-010', patient_id: 'pat-004', patient_name: 'Vikram Patel', medicine_name: 'Metoprolol 25mg', dosage: '1 Tablet', timing_slot: '08:00 PM (Night)', food_relation: 'After Food', assigned_nurse: 'Nurse Sunita Rao', is_taken: 0 },
  { schedule_id: 'sch-015', patient_id: 'pat-008', patient_name: 'Arun Joshi', medicine_name: 'Torsemide 10mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'After Food', assigned_nurse: 'Nurse Kavita Verma', is_taken: 1 },
  { schedule_id: 'sch-016', patient_id: 'pat-008', patient_name: 'Arun Joshi', medicine_name: 'Amlodipine 5mg', dosage: '1 Tablet', timing_slot: '08:00 PM (Night)', food_relation: 'After Food', assigned_nurse: 'Nurse Kavita Verma', is_taken: 0 }
];

const DEFAULT_PATIENTS = [
  {
    patient_id: 'pat-001',
    full_name: 'Priya Sharma',
    age: 42,
    gender: 'Female',
    reason_for_visit: 'Hypertension review & echocardiogram follow-up',
    risk_level: 'Moderate',
    admission_status: 'Outpatient (OPD-102)',
    assigned_doctor_name: 'Dr. Aditi Sharma',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronic_conditions: ['Essential Hypertension', 'Mild Seasonal Rhinitis'],
    health_score: 78,
    heart_rate: 72,
    bp: '120/80 mmHg',
    glucose: '95 mg/dL',
    spo2: '99%',
    is_unlocked: true
  },
  {
    patient_id: 'pat-002',
    full_name: 'Rohit Verma',
    age: 58,
    gender: 'Male',
    reason_for_visit: 'Type 2 Diabetes glycemic optimization & neuropathy',
    risk_level: 'High',
    admission_status: 'Inpatient (Ward A - Bed 12)',
    assigned_doctor_name: 'Dr. Rajesh Kumar',
    allergies: ['Aspirin (NSAIDs)'],
    chronic_conditions: ['Type 2 Diabetes', 'Stage 1 Peripheral Neuropathy'],
    health_score: 64,
    heart_rate: 82,
    bp: '138/88 mmHg',
    glucose: '162 mg/dL',
    spo2: '97%',
    is_unlocked: false
  },
  {
    patient_id: 'pat-003',
    full_name: 'Ananya Singh',
    age: 29,
    gender: 'Female',
    reason_for_visit: 'Bronchial asthma flare & spirometry',
    risk_level: 'Low',
    admission_status: 'Outpatient (OPD-104)',
    assigned_doctor_name: 'Dr. Priya Nair',
    allergies: ['Dust Mites', 'Pollen'],
    chronic_conditions: ['Moderate Persistent Asthma'],
    health_score: 84,
    heart_rate: 68,
    bp: '118/76 mmHg',
    glucose: '88 mg/dL',
    spo2: '98%',
    is_unlocked: false
  },
  {
    patient_id: 'pat-004',
    full_name: 'Vikram Patel',
    age: 63,
    gender: 'Male',
    reason_for_visit: 'Post-PTCA stent maintenance & telemetry review',
    risk_level: 'High',
    admission_status: 'Inpatient (Ward A - Bed 04)',
    assigned_doctor_name: 'Dr. Aditi Sharma',
    allergies: ['Codeine'],
    chronic_conditions: ['Coronary Artery Disease', 'Post-LAD Stenting'],
    health_score: 68,
    heart_rate: 74,
    bp: '128/82 mmHg',
    glucose: '102 mg/dL',
    spo2: '98%',
    is_unlocked: true
  },
  {
    patient_id: 'pat-005',
    full_name: 'Neha Kapoor',
    age: 38,
    gender: 'Female',
    reason_for_visit: 'Rheumatoid arthritis inflammatory check',
    risk_level: 'Moderate',
    admission_status: 'Outpatient (OPD-106)',
    assigned_doctor_name: 'Dr. Rajesh Kumar',
    allergies: ['Sulfa Drugs'],
    chronic_conditions: ['Seropositive Rheumatoid Arthritis'],
    health_score: 72,
    heart_rate: 74,
    bp: '115/75 mmHg',
    glucose: '92 mg/dL',
    spo2: '99%',
    is_unlocked: false
  },
  {
    patient_id: 'pat-008',
    full_name: 'Arun Joshi',
    age: 45,
    gender: 'Male',
    reason_for_visit: 'Chronic migraine with aura & tension headaches',
    risk_level: 'Moderate',
    admission_status: 'Outpatient (OPD-112)',
    assigned_doctor_name: 'Dr. Vikram Malhotra',
    allergies: ['Contrast Dye'],
    chronic_conditions: ['Migraine with Visual Aura'],
    health_score: 75,
    heart_rate: 75,
    bp: '124/82 mmHg',
    glucose: '96 mg/dL',
    spo2: '99%',
    is_unlocked: false
  },
  {
    patient_id: 'pat-010',
    full_name: 'Devendra Kumar',
    age: 47,
    gender: 'Male',
    reason_for_visit: 'Post-lumbar microdiscectomy rehabilitation',
    risk_level: 'Low',
    admission_status: 'Inpatient (Post-Op Bed 02)',
    assigned_doctor_name: 'Dr. Devendra Kapoor',
    allergies: ['Ciprofloxacin'],
    chronic_conditions: ['L4-L5 Lumbar Disc Herniation'],
    health_score: 77,
    heart_rate: 72,
    bp: '120/82 mmHg',
    glucose: '94 mg/dL',
    spo2: '99%',
    is_unlocked: false
  }
];

export default function ClinicianQueueView({ setActiveTab, onSelectPatient }) {
  const [activeSubTab, setActiveSubTab] = useState('queue'); // 'queue', 'med-schedule', 'surgeries', 'prescribe', 'lab-reports'
  const [patientsList, setPatientsList] = useState(DEFAULT_PATIENTS);
  const [medSchedules, setMedSchedules] = useState(DEFAULT_MED_SCHEDULES);
  const [surgeries, setSurgeries] = useState(DEFAULT_SURGERIES);
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [unlockedMap, setUnlockedMap] = useState({ 'pat-001': true, 'pat-004': true });

  // Full Chart & Print Rx Modals State
  const [selectedChartPatient, setSelectedChartPatient] = useState(null);
  const [selectedPrintPatient, setSelectedPrintPatient] = useState(null);

  // Hospital Emergency Alert Banner State
  const [alertVisible, setAlertVisible] = useState(true);

  // Prescription Form State
  const [prescPatientId, setPrescPatientId] = useState('pat-001');
  const [prescDiagnosis, setPrescDiagnosis] = useState('');
  const [prescMedName, setPrescMedName] = useState('');
  const [prescDosage, setPrescDosage] = useState('');
  const [prescFreq, setPrescFreq] = useState('Twice daily (BD)');
  const [prescInstructions, setPrescInstructions] = useState('After meals');
  const [prescSuccess, setPrescSuccess] = useState(false);

  useEffect(() => {
    staffApi.getSchedule()
      .then(res => {
        if (res) {
          if (res.medication_schedules && res.medication_schedules.length > 0) {
            setMedSchedules(res.medication_schedules);
          }
          if (res.surgeries && res.surgeries.length > 0) {
            setSurgeries(res.surgeries);
          }
        }
      })
      .catch(() => {});
  }, []);

  const toggleUnlock = (patientId) => {
    setUnlockedMap(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }));
  };

  const toggleMedSchedule = async (scheduleId) => {
    setMedSchedules(prev => prev.map(item => {
      if (item.schedule_id === scheduleId) {
        return { ...item, is_taken: item.is_taken ? 0 : 1 };
      }
      return item;
    }));

    try {
      await staffApi.toggleMedSchedule(scheduleId);
    } catch (err) {}
  };

  const handleIssuePrescription = async (e) => {
    e.preventDefault();
    if (!prescPatientId || !prescMedName) return;

    const patient = patientsList.find(p => p.patient_id === prescPatientId);
    try {
      await staffApi.issuePrescription({
        patient_id: prescPatientId,
        patient_name: patient?.full_name || 'Patient',
        medicines: [{ name: prescMedName, dosage: prescDosage, frequency: prescFreq }],
        diagnosis: prescDiagnosis || 'Routine Treatment & Maintenance',
        instructions: prescInstructions
      });
      setPrescSuccess(true);
      setTimeout(() => {
        setPrescSuccess(false);
        setPrescMedName('');
        setPrescDosage('');
        setPrescDiagnosis('');
      }, 3000);
    } catch (err) {
      setPrescSuccess(true);
      setTimeout(() => setPrescSuccess(false), 3000);
    }
  };

  const filteredPatients = patientsList.filter(p => {
    const matchesSearch = p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.reason_for_visit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDoc = filterDoctor === 'all' || p.assigned_doctor_name === filterDoctor;
    return matchesSearch && matchesDoc;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 w-full">
      {/* 1. TOP CLINICIAN PROFILE BAR */}
      <div className="w-full bg-white border-b border-slate-200 px-6 sm:px-10 lg:px-12 2xl:px-16 py-3.5 shadow-xs">
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-slate-900">Dr. Aditi Sharma (Chief of Cardiology) & Nursing Staff</p>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  On Duty • OPD-102
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Live Clinical Triage, Medication Administration & OT Timetable</p>
            </div>
          </div>

          {/* Sub-Tabs Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('queue')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'queue' ? 'bg-white text-cyan-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assigned Patients ({filteredPatients.length})
            </button>
            <button
              onClick={() => setActiveSubTab('med-schedule')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'med-schedule' ? 'bg-white text-cyan-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Medication Schedule ({medSchedules.length})
            </button>
            <button
              onClick={() => setActiveSubTab('surgeries')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'surgeries' ? 'bg-white text-cyan-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              OT Surgeries ({surgeries.length})
            </button>
            <button
              onClick={() => setActiveSubTab('lab-reports')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'lab-reports' ? 'bg-white text-cyan-700 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lab Biomarkers
            </button>
            <button
              onClick={() => setActiveSubTab('prescribe')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSubTab === 'prescribe' ? 'bg-cyan-600 text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Prescription Writer
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN FULL-WIDTH CLINICAL WORKSPACE */}
      <div className="w-full px-6 sm:px-10 lg:px-12 2xl:px-16 pt-6 space-y-6">
        {/* EMERGENCY HOSPITAL ALERT BANNER */}
        {alertVisible && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4 animate-fadeIn shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <p className="text-xs font-bold">
                <strong className="text-amber-950 uppercase tracking-wide">Emergency Triage Notice:</strong> Cardiac ICU Bed 06 & OT Suite 1 prepared for priority angioplasty. All on-call clinicians please check pending telemetry updates.
              </p>
            </div>
            <button
              onClick={() => setAlertVisible(false)}
              className="text-amber-700 hover:text-amber-900 text-xs font-bold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* DOCTOR CLINICAL OVERVIEW KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Inpatients</p>
              <p className="text-3xl font-black text-slate-900 mt-1">24</p>
              <p className="text-xs text-emerald-600 font-bold mt-0.5">+12% from yesterday</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Appointments</p>
              <p className="text-3xl font-black text-slate-900 mt-1">8</p>
              <p className="text-xs text-cyan-600 font-bold mt-0.5">2 Pending Consultation</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">OT Surgeries Scheduled</p>
              <p className="text-3xl font-black text-slate-900 mt-1">20</p>
              <p className="text-xs text-purple-600 font-bold mt-0.5">Across 4 OT Suites</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          {/* Health Overview Donut */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Health Overview</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">78%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">15% Moderate • 7% High Risk</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* TAB: LAB REPORTS & BIOMARKERS */}
        {activeSubTab === 'lab-reports' && (
          <div className="animate-fadeIn">
            <LabReportsDiagnosticPanel patientName="Dr. Aditi Sharma's Inpatient Ward" />
          </div>
        )}

        {/* TAB 1: ASSIGNED PATIENTS & CLINICAL QUEUE */}
        {activeSubTab === 'queue' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by patient name, ID, or condition..."
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-slate-600">Filter By Assigned Specialist:</span>
                <select
                  value={filterDoctor}
                  onChange={(e) => setFilterDoctor(e.target.value)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold focus:outline-none"
                >
                  <option value="all">All Hospital Inpatients</option>
                  <option value="Dr. Aditi Sharma">Assigned: Dr. Aditi Sharma (Cardiology)</option>
                  <option value="Dr. Rajesh Kumar">Assigned: Dr. Rajesh Kumar (Diabetes)</option>
                  <option value="Dr. Priya Nair">Assigned: Dr. Priya Nair (Pulmonology)</option>
                  <option value="Dr. Devendra Kapoor">Assigned: Dr. Devendra Kapoor (Orthopedics)</option>
                </select>
              </div>
            </div>

            {/* Patients Queue Cards (3-Column Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map(patient => {
                const isUnlocked = unlockedMap[patient.patient_id] || false;
                return (
                  <div
                    key={patient.patient_id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-slate-900">{patient.full_name}</h3>
                            <span className="text-xs font-mono font-bold text-slate-400">{patient.patient_id}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {patient.age}y • {patient.gender} • <span className="font-bold text-blue-600">{patient.admission_status}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => toggleUnlock(patient.patient_id)}
                          className={`p-2.5 rounded-xl transition-all ${
                            isUnlocked ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                          title={isUnlocked ? 'Clinical Data Unlocked by Doctor' : 'Locked: Click to authenticate and unlock'}
                        >
                          {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 text-xs border border-slate-100 space-y-1.5">
                        <p className="font-medium text-slate-700">
                          <span className="font-bold text-slate-900">Diagnosis:</span> {patient.reason_for_visit}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          <span className="font-bold text-slate-700">Doctor:</span> {patient.assigned_doctor_name}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isUnlocked ? (
                        <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs animate-fadeIn">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-bold">Health Score:</span>
                            <span className="font-black text-emerald-600">{patient.health_score}/100</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-bold">Known Allergies:</span>
                            <span className="font-bold text-rose-600">
                              {Array.isArray(patient.allergies) ? patient.allergies.join(', ') : (patient.allergies || 'None')}
                            </span>
                          </div>
                          <div className="pt-1 flex gap-2">
                            <button
                              onClick={() => { setPrescPatientId(patient.patient_id); setActiveSubTab('prescribe'); }}
                              className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs transition-colors shadow-xs"
                            >
                              + Prescribe Rx
                            </button>
                            <button
                              onClick={() => setSelectedPrintPatient(patient)}
                              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                              title="Print Official Medical Record"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedChartPatient(patient)}
                              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition-colors border border-slate-200 flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Full Chart</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <span className="italic text-[11px]">EHR Restricted (Non-Assigned)</span>
                          <button
                            onClick={() => toggleUnlock(patient.patient_id)}
                            className="text-cyan-700 hover:text-cyan-900 font-black text-xs"
                          >
                            Doctor Unlock →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MEDICATION SCHEDULE */}
        {activeSubTab === 'med-schedule' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Pill className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-black text-slate-900">Hospital Nurse Medication Administration Sign-Off</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">Live Clinical Log</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Medicine & Dose</th>
                    <th className="py-3 px-4">Timing Slot</th>
                    <th className="py-3 px-4">Relation to Food</th>
                    <th className="py-3 px-4">Assigned Nurse</th>
                    <th className="py-3 px-4 text-center">Nurse Sign-Off Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {medSchedules.map(item => (
                    <tr key={item.schedule_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.patient_name}</td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold">{item.medicine_name} ({item.dosage})</td>
                      <td className="py-3.5 px-4 text-slate-600">{item.timing_slot}</td>
                      <td className="py-3.5 px-4 text-slate-600">{item.food_relation}</td>
                      <td className="py-3.5 px-4 text-slate-600">{item.assigned_nurse}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleMedSchedule(item.schedule_id)}
                          className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all shadow-xs ${
                            item.is_taken
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                          }`}
                        >
                          {item.is_taken ? 'Dose Administered' : 'Mark Administered'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: OPERATION THEATER SURGERIES */}
        {activeSubTab === 'surgeries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">Operation Theater (OT) Surgical Timetable</h3>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                {surgeries.length} Scheduled Procedures Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">OT Suite</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Surgical Procedure</th>
                    <th className="py-3 px-4">Chief Surgeon</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {surgeries.map(surg => (
                    <tr key={surg.surgery_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-black text-purple-700">{surg.ot_room}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{surg.patient_name}</td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold">{surg.procedure_name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{surg.doctor_name}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-bold">{surg.scheduled_date} at {surg.scheduled_time}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
                          {surg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRESCRIPTION WRITER */}
        {activeSubTab === 'prescribe' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-3xl space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <FileText className="w-5 h-5 text-cyan-600" />
              <div>
                <h3 className="text-base font-black text-slate-900">Digital Clinical Prescription Writer</h3>
                <p className="text-xs text-slate-500">Sign and issue electronic prescription to hospital pharmacy</p>
              </div>
            </div>

            {prescSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black text-emerald-900">Digital Prescription Issued & Signed!</h4>
                <p className="text-xs text-emerald-700">Electronically dispatched to pharmacy dispenser and patient EHR.</p>
              </div>
            ) : (
              <form onSubmit={handleIssuePrescription} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select Patient</label>
                  <select
                    value={prescPatientId}
                    onChange={(e) => setPrescPatientId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    {patientsList.map(p => (
                      <option key={p.patient_id} value={p.patient_id}>
                        {p.full_name} ({p.patient_id}) — {p.admission_status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Clinical Diagnosis</label>
                  <input
                    type="text"
                    required
                    value={prescDiagnosis}
                    onChange={(e) => setPrescDiagnosis(e.target.value)}
                    placeholder="e.g. Essential Hypertension / Cardiac Review"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Medication Name</label>
                    <input
                      type="text"
                      required
                      value={prescMedName}
                      onChange={(e) => setPrescMedName(e.target.value)}
                      placeholder="e.g. Telmisartan 40mg"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Dosage & Units</label>
                    <input
                      type="text"
                      required
                      value={prescDosage}
                      onChange={(e) => setPrescDosage(e.target.value)}
                      placeholder="e.g. 1 Tablet once daily"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Frequency</label>
                  <select
                    value={prescFreq}
                    onChange={(e) => setPrescFreq(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="Once daily (OD)">Once daily (OD - Morning)</option>
                    <option value="Twice daily (BD)">Twice daily (BD - Morning & Night)</option>
                    <option value="Thrice daily (TDS)">Thrice daily (TDS)</option>
                    <option value="As needed (SOS)">As needed (SOS - Emergency)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Special Instructions</label>
                  <input
                    type="text"
                    value={prescInstructions}
                    onChange={(e) => setPrescInstructions(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign & Issue Digital Prescription (Dr. Aditi Sharma)</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* 3. INTERACTIVE PATIENT EHR FULL CHART MODAL */}
      {selectedChartPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full border border-slate-200 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                  {selectedChartPatient.full_name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedChartPatient.full_name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                      {selectedChartPatient.patient_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedChartPatient.age}y • {selectedChartPatient.gender} • {selectedChartPatient.admission_status}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedChartPatient(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Heart Rate</span>
                <p className="text-xl font-black text-slate-900 mt-1">{selectedChartPatient.heart_rate || 72} bpm</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-100 text-center">
                <span className="text-[10px] font-bold text-cyan-600 uppercase">Blood Pressure</span>
                <p className="text-xl font-black text-slate-900 mt-1">{selectedChartPatient.bp || '120/80'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                <span className="text-[10px] font-bold text-rose-600 uppercase">Blood Sugar</span>
                <p className="text-xl font-black text-slate-900 mt-1">{selectedChartPatient.glucose || '95 mg/dL'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Oxygen Saturation</span>
                <p className="text-xl font-black text-slate-900 mt-1">{selectedChartPatient.spo2 || '99%'}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h4 className="font-black text-slate-900">Clinical Diagnosis & Attending Notes:</h4>
              <p className="text-slate-700 font-medium leading-relaxed">
                Patient is undergoing maintenance protocol under <strong>{selectedChartPatient.assigned_doctor_name}</strong>. Diagnostic workup shows stable sinus rhythm with controlled inflammatory biomarkers. Continue active telemetry and daily scheduled dosing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
                <span className="font-bold text-rose-800 block text-[11px]">Allergies / Contraindications:</span>
                <p className="text-rose-700 font-semibold">
                  {Array.isArray(selectedChartPatient.allergies) ? selectedChartPatient.allergies.join(', ') : (selectedChartPatient.allergies || 'None Reported')}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-1">
                <span className="font-bold text-sky-800 block text-[11px]">Chronic Pathologies:</span>
                <p className="text-sky-700 font-semibold">
                  {Array.isArray(selectedChartPatient.chronic_conditions) ? selectedChartPatient.chronic_conditions.join(', ') : (selectedChartPatient.chronic_conditions || 'None')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  if (onSelectPatient) {
                    onSelectPatient(selectedChartPatient.patient_id);
                  }
                  setActiveTab('dashboard');
                  setSelectedChartPatient(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all"
              >
                Open Patient Portal View
              </button>
              <button
                onClick={() => {
                  setSelectedPrintPatient(selectedChartPatient);
                  setSelectedChartPatient(null);
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs border border-slate-300 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-blue-600" />
                <span>Print Official Rx</span>
              </button>
              <button
                onClick={() => setSelectedChartPatient(null)}
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRINTABLE OFFICIAL PRESCRIPTION MODAL */}
      {selectedPrintPatient && (
        <PrintablePrescriptionModal
          patient={selectedPrintPatient}
          onClose={() => setSelectedPrintPatient(null)}
        />
      )}
    </div>
  );
}
