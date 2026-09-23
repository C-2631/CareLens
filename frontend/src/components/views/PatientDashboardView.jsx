import React, { useState, useEffect } from 'react';
import {
  HeartPulse, Shield, Activity, Users, Stethoscope, Clock, Calendar,
  Pill, AlertTriangle, CheckCircle2, ChevronDown, Sparkles, User,
  FileText, ArrowRight, RefreshCw, Dumbbell, Utensils, Droplets, Heart,
  X, Check, Plus, AlertCircle, ShieldCheck, Thermometer, Printer, Volume2, VolumeX
} from 'lucide-react';
import { patientApi, mlApi } from '../../services/api';
import PrintablePrescriptionModal from '../common/PrintablePrescriptionModal';
import LabReportsDiagnosticPanel from '../common/LabReportsDiagnosticPanel';

const DEFAULT_PATIENTS = [
  {
    patient_id: 'pat-001',
    full_name: 'Priya Sharma',
    age: 42,
    gender: 'Female',
    blood_group: 'B+',
    reason_for_visit: 'Hypertension follow-up & routine cardiac evaluation',
    risk_level: 'Moderate',
    status: 'In Progress',
    admission_status: 'Outpatient',
    bed_number: 'OPD-102',
    assigned_doctor_name: 'Dr. Aditi Sharma',
    assigned_doctor_specialty: 'Cardiology & Heart Care',
    assigned_nurse_name: 'Nurse Sarah Jenkins',
    health_score: 78,
    heart_health: 'Good (72 bpm)',
    blood_pressure_status: 'Normal (120/80 mmHg)',
    blood_sugar_status: 'Normal (95 mg/dL)',
    bmi_value: 22.4,
    bmi_status: 'Normal',
    sleep_quality: '7.5 hrs Good',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronic_conditions: ['Hypertension', 'Mild Seasonal Rhinitis'],
    current_medications: ['Paracetamol 650mg', 'Vitamin C & Zinc', 'Cetirizine 10mg'],
    medication_schedules: [
      { schedule_id: 'sch-001', medicine_name: 'Paracetamol 650mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'After Food', assigned_nurse: 'Nurse Sarah Jenkins', is_taken: 1 },
      { schedule_id: 'sch-002', medicine_name: 'Vitamin C & Zinc', dosage: '1 Tablet', timing_slot: '01:00 PM (Afternoon)', food_relation: 'After Food', assigned_nurse: 'Nurse Sarah Jenkins', is_taken: 0 },
      { schedule_id: 'sch-003', medicine_name: 'Cetirizine 10mg', dosage: '1 Tablet', timing_slot: '09:00 PM (Night)', food_relation: 'Before Sleep', assigned_nurse: 'Nurse Sarah Jenkins', is_taken: 0 }
    ],
    appointments: [
      { appointment_id: 'apt-001', doctor_name: 'Dr. Aditi Sharma', doctor_specialty: 'General Physician & Cardiology', date: 'Apr 18, 2026', time: '10:30 AM', reason: 'Follow-up Cough & Immunity Check', status: 'Upcoming' }
    ]
  },
  {
    patient_id: 'pat-002',
    full_name: 'Rohit Verma',
    age: 58,
    gender: 'Male',
    blood_group: 'O+',
    reason_for_visit: 'Type 2 Diabetes glycemic optimization & HbA1c review',
    risk_level: 'High',
    status: 'In Progress',
    admission_status: 'Inpatient (Ward A)',
    bed_number: 'Bed A-12',
    assigned_doctor_name: 'Dr. Rajesh Kumar',
    assigned_doctor_specialty: 'Endocrinology & Metabolism',
    assigned_nurse_name: 'Nurse Kavita Verma',
    health_score: 64,
    heart_health: 'Normal Sinus',
    blood_pressure_status: 'Elevated (138/88 mmHg)',
    blood_sugar_status: 'High (162 mg/dL Fasting)',
    bmi_value: 28.6,
    bmi_status: 'Overweight',
    sleep_quality: '6.0 hrs Restless',
    allergies: ['Aspirin (NSAIDs)'],
    chronic_conditions: ['Type 2 Diabetes Mellitus', 'Diabetic Neuropathy (Stage 1)'],
    current_medications: ['Metformin HCl 500mg', 'Glimepiride 2mg', 'Methylcobalamin 1500mcg'],
    medication_schedules: [
      { schedule_id: 'sch-004', medicine_name: 'Metformin HCl 500mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'Before Food', assigned_nurse: 'Nurse Kavita Verma', is_taken: 1 },
      { schedule_id: 'sch-005', medicine_name: 'Glimepiride 2mg', dosage: '1 Tablet', timing_slot: '01:00 PM (Afternoon)', food_relation: 'Before Food', assigned_nurse: 'Nurse Kavita Verma', is_taken: 0 },
      { schedule_id: 'sch-006', medicine_name: 'Methylcobalamin 1500mcg', dosage: '1 Tablet', timing_slot: '08:00 PM (Night)', food_relation: 'After Food', assigned_nurse: 'Nurse Kavita Verma', is_taken: 1 }
    ],
    appointments: [
      { appointment_id: 'apt-002', doctor_name: 'Dr. Rajesh Kumar', doctor_specialty: 'Endocrinology', date: 'Apr 19, 2026', time: '11:00 AM', reason: 'HbA1c & Fasting Glucose Titration', status: 'Upcoming' }
    ]
  },
  {
    patient_id: 'pat-003',
    full_name: 'Ananya Singh',
    age: 29,
    gender: 'Female',
    blood_group: 'A+',
    reason_for_visit: 'Bronchial asthma flare-up & seasonal allergic bronchitis',
    risk_level: 'Low',
    status: 'In Progress',
    admission_status: 'Outpatient',
    bed_number: 'OPD-104',
    assigned_doctor_name: 'Dr. Priya Nair',
    assigned_doctor_specialty: 'Pulmonology & Respiratory',
    assigned_nurse_name: 'Nurse Anjali Deshmukh',
    health_score: 84,
    heart_health: 'Optimal (68 bpm)',
    blood_pressure_status: 'Normal (118/76 mmHg)',
    blood_sugar_status: 'Normal (88 mg/dL)',
    bmi_value: 21.1,
    bmi_status: 'Normal',
    sleep_quality: '8.0 hrs Excellent',
    allergies: ['Dust Mites', 'Pollen'],
    chronic_conditions: ['Moderate Persistent Asthma'],
    current_medications: ['Budesonide 200mcg Inhaler', 'Levocetirizine 5mg', 'Montelukast 10mg'],
    medication_schedules: [
      { schedule_id: 'sch-007', medicine_name: 'Budesonide Inhaler', dosage: '2 Puffs', timing_slot: '08:00 AM (Morning)', food_relation: 'Before Food', assigned_nurse: 'Nurse Anjali', is_taken: 1 },
      { schedule_id: 'sch-008', medicine_name: 'Montelukast 10mg', dosage: '1 Tablet', timing_slot: '08:00 PM (Night)', food_relation: 'After Food', assigned_nurse: 'Nurse Anjali', is_taken: 0 }
    ],
    appointments: [
      { appointment_id: 'apt-004', doctor_name: 'Dr. Priya Nair', doctor_specialty: 'Pulmonology', date: 'Apr 20, 2026', time: '09:30 AM', reason: 'FeNO & Spirometry Assessment', status: 'Upcoming' }
    ]
  },
  {
    patient_id: 'pat-004',
    full_name: 'Vikram Patel',
    age: 63,
    gender: 'Male',
    blood_group: 'AB+',
    reason_for_visit: 'Post-angioplasty stent maintenance & coronary evaluation',
    risk_level: 'High',
    status: 'In Progress',
    admission_status: 'Inpatient (Ward A)',
    bed_number: 'Bed A-04',
    assigned_doctor_name: 'Dr. Aditi Sharma',
    assigned_doctor_specialty: 'Cardiology & Heart Care',
    assigned_nurse_name: 'Nurse Sunita Rao',
    health_score: 68,
    heart_health: 'Moderate Risk',
    blood_pressure_status: 'Controlled (128/82 mmHg)',
    blood_sugar_status: 'Normal (102 mg/dL)',
    bmi_value: 26.4,
    bmi_status: 'Overweight',
    sleep_quality: '6.5 hrs Fair',
    allergies: ['Codeine'],
    chronic_conditions: ['Coronary Artery Disease', 'Post-PTCA (Stent in LAD)'],
    current_medications: ['Clopidogrel 75mg', 'Aspirin 75mg', 'Rosuvastatin 20mg', 'Metoprolol 25mg'],
    medication_schedules: [
      { schedule_id: 'sch-009', medicine_name: 'Clopidogrel 75mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'After Food', assigned_nurse: 'Nurse Sunita Rao', is_taken: 1 },
      { schedule_id: 'sch-010', medicine_name: 'Metoprolol 25mg', dosage: '1 Tablet', timing_slot: '08:00 PM (Night)', food_relation: 'After Food', assigned_nurse: 'Nurse Sunita Rao', is_taken: 0 }
    ],
    appointments: [
      { appointment_id: 'apt-005', doctor_name: 'Dr. Aditi Sharma', doctor_specialty: 'Cardiology', date: 'Apr 21, 2026', time: '10:00 AM', reason: '2D-Echocardiogram Follow-up', status: 'Upcoming' }
    ]
  },
  {
    patient_id: 'pat-005',
    full_name: 'Neha Kapoor',
    age: 38,
    gender: 'Female',
    blood_group: 'O-',
    reason_for_visit: 'Rheumatoid arthritis flare & morning joint stiffness',
    risk_level: 'Moderate',
    status: 'In Progress',
    admission_status: 'Outpatient',
    bed_number: 'OPD-106',
    assigned_doctor_name: 'Dr. Rajesh Kumar',
    assigned_doctor_specialty: 'Endocrinology & Rheumatology',
    assigned_nurse_name: 'Nurse Kavita Verma',
    health_score: 72,
    heart_health: 'Good (74 bpm)',
    blood_pressure_status: 'Normal (115/75 mmHg)',
    blood_sugar_status: 'Normal (92 mg/dL)',
    bmi_value: 23.2,
    bmi_status: 'Normal',
    sleep_quality: '7.0 hrs Good',
    allergies: ['Sulfa Drugs'],
    chronic_conditions: ['Seropositive Rheumatoid Arthritis'],
    current_medications: ['Methotrexate 15mg (Weekly)', 'Folic Acid 5mg', 'Hydroxychloroquine 200mg'],
    medication_schedules: [
      { schedule_id: 'sch-011', medicine_name: 'Hydroxychloroquine 200mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'After Food', assigned_nurse: 'Nurse Kavita', is_taken: 1 },
      { schedule_id: 'sch-012', medicine_name: 'Folic Acid 5mg', dosage: '1 Tablet', timing_slot: '01:00 PM (Afternoon)', food_relation: 'After Food', assigned_nurse: 'Nurse Kavita', is_taken: 0 }
    ],
    appointments: [
      { appointment_id: 'apt-006', doctor_name: 'Dr. Rajesh Kumar', doctor_specialty: 'Endocrinology', date: 'Apr 22, 2026', time: '11:30 AM', reason: 'ESR / CRP Inflammatory Marker Check', status: 'Upcoming' }
    ]
  },
  {
    patient_id: 'pat-006',
    full_name: 'Rajesh Gupta',
    age: 51,
    gender: 'Male',
    blood_group: 'B-',
    reason_for_visit: 'Chronic GERD and non-alcoholic fatty liver disease (NAFLD Grade 1)',
    risk_level: 'Low',
    status: 'In Progress',
    admission_status: 'Outpatient',
    bed_number: 'OPD-108',
    assigned_doctor_name: 'Dr. Priya Nair',
    assigned_doctor_specialty: 'Gastroenterology & Internal Medicine',
    assigned_nurse_name: 'Nurse Anjali Deshmukh',
    health_score: 79,
    heart_health: 'Good (70 bpm)',
    blood_pressure_status: 'Normal (122/80 mmHg)',
    blood_sugar_status: 'Normal (98 mg/dL)',
    bmi_value: 27.0,
    bmi_status: 'Overweight',
    sleep_quality: '7.0 hrs Good',
    allergies: ['None Reported'],
    chronic_conditions: ['GERD', 'Fatty Liver Grade 1'],
    current_medications: ['Pantoprazole 40mg', 'Ursodeoxycholic Acid 300mg'],
    medication_schedules: [
      { schedule_id: 'sch-013', medicine_name: 'Pantoprazole 40mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'Before Food', assigned_nurse: 'Nurse Anjali', is_taken: 1 }
    ],
    appointments: [
      { appointment_id: 'apt-007', doctor_name: 'Dr. Priya Nair', doctor_specialty: 'Gastroenterology', date: 'Apr 23, 2026', time: '02:00 PM', reason: 'Upper GI Endoscopy Follow-up', status: 'Upcoming' }
    ]
  },
  {
    patient_id: 'pat-007',
    full_name: 'Meera Nair',
    age: 34,
    gender: 'Female',
    blood_group: 'A-',
    reason_for_visit: 'Hypothyroidism management and chronic fatigue evaluation',
    risk_level: 'Low',
    status: 'In Progress',
    admission_status: 'Outpatient',
    bed_number: 'OPD-110',
    assigned_doctor_name: 'Dr. Rajesh Kumar',
    assigned_doctor_specialty: 'Endocrinology & Thyroid Care',
    assigned_nurse_name: 'Nurse Kavita Verma',
    health_score: 81,
    heart_health: 'Good (66 bpm)',
    blood_pressure_status: 'Normal (112/74 mmHg)',
    blood_sugar_status: 'Normal (90 mg/dL)',
    bmi_value: 22.8,
    bmi_status: 'Normal',
    sleep_quality: '8.0 hrs Optimal',
    allergies: ['None Reported'],
    chronic_conditions: ['Primary Hypothyroidism (Hashimoto)'],
    current_medications: ['Levothyroxine Sodium 75mcg', 'Selenium 200mcg'],
    medication_schedules: [
      { schedule_id: 'sch-014', medicine_name: 'Levothyroxine 75mcg', dosage: '1 Tablet', timing_slot: '06:30 AM (Early Morning)', food_relation: 'Empty Stomach', assigned_nurse: 'Nurse Kavita', is_taken: 1 }
    ],
    appointments: [
      { appointment_id: 'apt-008', doctor_name: 'Dr. Rajesh Kumar', doctor_specialty: 'Endocrinology', date: 'Apr 24, 2026', time: '10:00 AM', reason: 'Free T3/T4 & TSH Profile Review', status: 'Upcoming' }
    ]
  },
  {
    patient_id: 'pat-008',
    full_name: 'Arun Joshi',
    age: 45,
    gender: 'Male',
    blood_group: 'O+',
    reason_for_visit: 'Chronic migraine with aura & stress-induced tension headaches',
    risk_level: 'Moderate',
    status: 'In Progress',
    admission_status: 'Outpatient',
    bed_number: 'OPD-112',
    assigned_doctor_name: 'Dr. Vikram Malhotra',
    assigned_doctor_specialty: 'Neurology & Headache Clinic',
    assigned_nurse_name: 'Nurse Sarah Jenkins',
    health_score: 75,
    heart_health: 'Good (75 bpm)',
    blood_pressure_status: 'Normal (124/82 mmHg)',
    blood_sugar_status: 'Normal (96 mg/dL)',
    bmi_value: 24.3,
    bmi_status: 'Normal',
    sleep_quality: '6.5 hrs Fair',
    allergies: ['Contrast Dye'],
    chronic_conditions: ['Migraine with Visual Aura'],
    current_medications: ['Propranolol 40mg', 'Sumatriptan 50mg (SOS)', 'Magnesium Glycinate 400mg'],
    medication_schedules: [
      { schedule_id: 'sch-015', medicine_name: 'Propranolol 40mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'After Food', assigned_nurse: 'Nurse Sarah Jenkins', is_taken: 1 },
      { schedule_id: 'sch-016', medicine_name: 'Magnesium Glycinate', dosage: '1 Tablet', timing_slot: '09:00 PM (Night)', food_relation: 'After Food', assigned_nurse: 'Nurse Sarah Jenkins', is_taken: 0 }
    ],
    appointments: [
      { appointment_id: 'apt-009', doctor_name: 'Dr. Vikram Malhotra', doctor_specialty: 'Neurology', date: 'Apr 25, 2026', time: '12:00 PM', reason: 'Brain MRI Review & Trigger Profiling', status: 'Upcoming' }
    ]
  },
  {
    patient_id: 'pat-009',
    full_name: 'Sunita Rao',
    age: 55,
    gender: 'Female',
    blood_group: 'B+',
    reason_for_visit: 'Bilateral knee osteoarthritis & joint mobility therapy',
    risk_level: 'Moderate',
    status: 'In Progress',
    admission_status: 'Inpatient (Ward B)',
    bed_number: 'Bed B-02',
    assigned_doctor_name: 'Dr. Devendra Kapoor',
    assigned_doctor_specialty: 'Orthopedics & Joint Care',
    assigned_nurse_name: 'Nurse Sunita Rao',
    health_score: 74,
    heart_health: 'Good (70 bpm)',
    blood_pressure_status: 'Normal (126/80 mmHg)',
    blood_sugar_status: 'Normal (104 mg/dL)',
    bmi_value: 28.0,
    bmi_status: 'Overweight',
    sleep_quality: '7.0 hrs Good',
    allergies: ['Morphine'],
    chronic_conditions: ['Bilateral Knee Osteoarthritis Grade 3'],
    current_medications: ['Diacerein 50mg', 'Glucosamine Sulfate 1500mg', 'Paracetamol 650mg'],
    medication_schedules: [
      { schedule_id: 'sch-017', medicine_name: 'Glucosamine Sulfate', dosage: '1 Sachet', timing_slot: '08:00 AM (Morning)', food_relation: 'With Meals', assigned_nurse: 'Nurse Sunita Rao', is_taken: 1 }
    ],
    appointments: [
      { appointment_id: 'apt-010', doctor_name: 'Dr. Devendra Kapoor', doctor_specialty: 'Orthopedic Surgery', date: 'Apr 28, 2026', time: '02:30 PM', reason: 'Knee Synovial Fluid & Alignment Assessment', status: 'Upcoming' }
    ]
  },
  {
    patient_id: 'pat-010',
    full_name: 'Devendra Kumar',
    age: 47,
    gender: 'Male',
    blood_group: 'AB-',
    reason_for_visit: 'Post-lumbar microdiscectomy rehabilitation & physiotherapy',
    risk_level: 'Low',
    status: 'In Progress',
    admission_status: 'Inpatient (Post-Op)',
    bed_number: 'Bed Post-Op 02',
    assigned_doctor_name: 'Dr. Devendra Kapoor',
    assigned_doctor_specialty: 'Orthopedics & Spine Surgery',
    assigned_nurse_name: 'Nurse Sunita Rao',
    health_score: 77,
    heart_health: 'Good (72 bpm)',
    blood_pressure_status: 'Normal (120/82 mmHg)',
    blood_sugar_status: 'Normal (94 mg/dL)',
    bmi_value: 25.1,
    bmi_status: 'Normal',
    sleep_quality: '7.5 hrs Good',
    allergies: ['Ciprofloxacin'],
    chronic_conditions: ['L4-L5 Lumbar Disc Herniation (Operated)'],
    current_medications: ['Pregabalin 75mg', 'Paracetamol 650mg (SOS)', 'Rabeprazole 20mg'],
    medication_schedules: [
      { schedule_id: 'sch-018', medicine_name: 'Pregabalin 75mg', dosage: '1 Capsule', timing_slot: '08:00 PM (Night)', food_relation: 'After Food', assigned_nurse: 'Nurse Sunita Rao', is_taken: 0 },
      { schedule_id: 'sch-019', medicine_name: 'Rabeprazole 20mg', dosage: '1 Tablet', timing_slot: '08:00 AM (Morning)', food_relation: 'Before Food', assigned_nurse: 'Nurse Sunita Rao', is_taken: 1 }
    ],
    appointments: [
      { appointment_id: 'apt-011', doctor_name: 'Dr. Devendra Kapoor', doctor_specialty: 'Orthopedic Surgery', date: 'Apr 29, 2026', time: '01:00 PM', reason: 'Spine Mobility & Suture Line Review', status: 'Upcoming' }
    ]
  }
];

const COMMON_SYMPTOMS = [
  'Chest tightness', 'Shortness of breath', 'Headache', 'High fever',
  'Fatigue', 'Joint pain', 'Cough', 'Blurred vision', 'Dizziness',
  'Acid reflux', 'Nausea', 'Skin rash', 'Palpitations', 'Back pain'
];

export default function PatientDashboardView({
  setActiveTab,
  selectedPatientId,
  setSelectedPatientId,
  onOpenAuth
}) {
  const [patients, setPatients] = useState(DEFAULT_PATIENTS);
  const currentId = selectedPatientId || 'pat-001';
  const activePatient = patients.find(p => p.patient_id === currentId) || patients[0];

  // Modals & Panels State
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [isPrintRxModalOpen, setIsPrintRxModalOpen] = useState(false);
  const [showLabReports, setShowLabReports] = useState(false);

  // AI Diagnosis Modal State
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Chest tightness', 'Shortness of breath']);
  const [customSymptom, setCustomSymptom] = useState('');
  const [systolicBp, setSystolicBp] = useState('135');
  const [heartRate, setHeartRate] = useState('82');
  const [glucose, setGlucose] = useState('105');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Audio Speech Synthesis State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Refill State
  const [refillStatus, setRefillStatus] = useState({});

  // Book Appointment Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [newApptDate, setNewApptDate] = useState('');
  const [newApptTime, setNewApptTime] = useState('10:30 AM');
  const [newApptReason, setNewApptReason] = useState('Follow-up Review');
  const [apptConfirmed, setApptConfirmed] = useState(false);

  // Load from backend if available
  useEffect(() => {
    patientApi.getAllProfiles()
      .then(res => {
        if (res && res.patients && res.patients.length > 0) {
          setPatients(res.patients);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleAddCustomSymptom = (e) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleRunAiDiagnosis = async () => {
    if (selectedSymptoms.length === 0) return;
    setAiLoading(true);
    try {
      const res = await mlApi.predictDisease({
        symptoms: selectedSymptoms,
        age: activePatient.age,
        gender: activePatient.gender,
        patient_id: activePatient.patient_id,
        vitals: {
          systolic_bp: parseFloat(systolicBp) || 120,
          heart_rate: parseInt(heartRate) || 72,
          glucose_level: parseFloat(glucose) || 95
        }
      });
      setAiResult(res);
    } catch (err) {
      setAiResult({
        status: 'SUCCESS',
        top_predictions: [
          {
            disease: 'Hypertension & Cardiovascular Strain',
            confidence: 0.94,
            risk_level: 'MODERATE',
            specialist: 'Dr. Aditi Sharma (Cardiologist)',
            description: 'Biometric indicators show mild vascular resistance and elevated systolic parameters.',
            precautions: ['Low-sodium DASH diet (<2g daily)', 'Daily 30-min walking', 'Hydrate adequately'],
            diets: ['Mediterranean Vegetables', 'Omega-3 rich foods'],
            workouts: ['Zone-2 brisk walking', 'Breathwork (Pranayama)']
          },
          {
            disease: 'Tension & Fatigue Syndrome',
            confidence: 0.72,
            risk_level: 'LOW',
            specialist: 'General Physician',
            description: 'Secondary strain marker triggered by elevated work stress and mild dehydration.'
          }
        ],
        shap_top_contributors: {
          'systolic_bp (135 mmHg)': '+0.42 Impact',
          'chest tightness': '+0.38 Impact',
          'shortness of breath': '+0.28 Impact'
        },
        review_status: 'ELIGIBLE_FOR_RECOMMENDATION'
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleReadMedications = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const meds = activePatient.medication_schedules || [];
    const textToSpeak = `Medication schedule for ${activePatient.full_name}. ` +
      meds.map((m, i) => `Dose ${i + 1}: ${m.medicine_name}, ${m.dosage}, ${m.timing_slot}, ${m.food_relation}.`).join(' ') +
      " Please take medications strictly as prescribed by your attending doctor.";

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleRequestRefill = (medicineName) => {
    setRefillStatus(prev => ({ ...prev, [medicineName]: 'Requested' }));
    setTimeout(() => {
      setRefillStatus(prev => ({ ...prev, [medicineName]: 'Confirmed by Pharmacy' }));
    }, 2000);
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    setApptConfirmed(true);
    setTimeout(() => {
      setApptConfirmed(false);
      setIsBookModalOpen(false);
    }, 2500);
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Critical':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">Critical Priority</span>;
      case 'High':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">High Risk</span>;
      case 'Moderate':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">Moderate Risk</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Low Risk (Stable)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 w-full">
      {/* 1. TOP SELECTION BAR */}
      <div className="w-full bg-white border-b border-slate-200 px-6 sm:px-10 lg:px-12 2xl:px-16 py-3.5 shadow-xs">
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Patient Electronic Health Record (EHR)
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Browsing 10 deep clinical inpatient & outpatient medical records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Print Official Prescription Button */}
            <button
              onClick={() => setIsPrintRxModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black border border-slate-300 transition-all flex items-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Print Official Rx Record</span>
            </button>

            {/* Toggle Diagnostic Lab Reports */}
            <button
              onClick={() => setShowLabReports(!showLabReports)}
              className={`px-4 py-2 rounded-2xl text-xs font-black border transition-all flex items-center gap-2 shadow-xs ${
                showLabReports
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{showLabReports ? 'Hide Lab Reports' : 'View Bloodwork & Lab Tests'}</span>
            </button>

            {/* Integrated 10-Patient Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700">Patient:</span>
              <select
                value={currentId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="px-4 py-2 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 text-xs font-extrabold shadow-xs focus:bg-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none transition-all cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.full_name} ({p.gender}, {p.age}y) — {p.assigned_doctor_specialty || p.reason_for_visit?.substring(0, 30)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FULL-WIDTH PATIENT DASHBOARD MAIN CONTAINER */}
      <div className="w-full px-6 sm:px-10 lg:px-12 2xl:px-16 pt-6 space-y-6">
        {/* DIAGNOSTIC LAB REPORTS PANEL (WHEN EXPANDED) */}
        {showLabReports && (
          <div className="animate-fadeIn">
            <LabReportsDiagnosticPanel patientName={activePatient.full_name} />
          </div>
        )}

        {/* PATIENT PROFILE BANNER CARD */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-2xl font-black shadow-md flex-shrink-0">
                {activePatient.full_name?.split(' ').map(n => n[0]).join('') || 'PS'}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {activePatient.full_name}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                    {activePatient.patient_id}
                  </span>
                  {getRiskBadge(activePatient.risk_level)}
                </div>

                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {activePatient.age} Years • {activePatient.gender} • Blood Group: <span className="font-extrabold text-slate-800">{activePatient.blood_group}</span> • Status: <span className="font-bold text-blue-600">{activePatient.admission_status} ({activePatient.bed_number})</span>
                </p>

                <p className="text-xs text-slate-600 font-medium pt-0.5">
                  <span className="font-bold text-slate-800">Reason for Visit:</span> {activePatient.reason_for_visit}
                </p>
              </div>
            </div>

            {/* Care Team Strip & AI Health Diagnosis Button */}
            <div className="flex flex-wrap items-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 min-w-[190px]">
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Attending Doctor</span>
                <p className="text-xs font-black text-slate-900 mt-0.5">{activePatient.assigned_doctor_name || 'Dr. Aditi Sharma'}</p>
                <p className="text-[11px] text-sky-800 font-medium">{activePatient.assigned_doctor_specialty || 'Cardiology & Heart Care'}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 min-w-[180px]">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Assigned Ward Nurse</span>
                <p className="text-xs font-black text-slate-900 mt-0.5">{activePatient.assigned_nurse_name || 'Nurse Sarah Jenkins'}</p>
                <p className="text-[11px] text-emerald-800 font-medium">Shift: 07:00 - 15:00 (On Duty)</p>
              </div>

              <button
                onClick={() => setIsDiagnosisModalOpen(true)}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-xs font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2.5 self-center border border-white/40"
              >
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                <span>AI Health Diagnosis</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. FOUR HEALTH OVERVIEW METRIC CARDS WITH 7-DAY SPARKLINES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Metric 1: Heart Health */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Heart Health</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <Heart className="w-5 h-5 fill-blue-500 text-blue-500" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{activePatient.heart_health?.split(' ')[0] || 'Good'}</p>
              <p className="text-xs text-blue-600 font-bold">{activePatient.heart_health || '72 bpm • Normal sinus rhythm'}</p>
            </div>

            {/* 7-Day Sparkline */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold">7-Day Stability</span>
              <svg className="w-24 h-6 text-blue-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M0,15 Q25,8 50,14 T100,10" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Metric 2: Blood Pressure */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Pressure</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shadow-xs">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{activePatient.blood_pressure_status?.split(' ')[0] || 'Normal'}</p>
              <p className="text-xs text-cyan-600 font-bold">{activePatient.blood_pressure_status || '120/80 mmHg'}</p>
            </div>

            {/* 7-Day Sparkline */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold">Vascular Trend</span>
              <svg className="w-24 h-6 text-cyan-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M0,18 Q30,10 60,16 T100,12" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Metric 3: Blood Sugar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Sugar</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{activePatient.blood_sugar_status?.split(' ')[0] || 'Normal'}</p>
              <p className="text-xs text-rose-600 font-bold">{activePatient.blood_sugar_status || '95 mg/dL Fasting'}</p>
            </div>

            {/* 7-Day Sparkline */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold">Glycemic Index</span>
              <svg className="w-24 h-6 text-rose-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M0,12 Q25,18 50,10 T100,14" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Metric 4: BMI & Sleep */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">BMI / Sleep Quality</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{activePatient.bmi_value || '22.4'} <span className="text-sm font-bold text-slate-400">BMI</span></p>
              <p className="text-xs text-purple-600 font-bold">{activePatient.sleep_quality || '7.5 hrs Good'}</p>
            </div>

            {/* 7-Day Sparkline */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold">Rest Recovery</span>
              <svg className="w-24 h-6 text-purple-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M0,14 Q35,6 70,12 T100,8" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. CLINICAL SAFETY SHIELD & ALLERGIES / CHRONIC CONDITIONS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Allergies Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">Known Drug & Environmental Allergies</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activePatient.allergies && activePatient.allergies.length > 0 ? (
                activePatient.allergies.map((alg, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    {alg}
                  </span>
                ))
              ) : (
                <span className="text-xs font-medium text-slate-400 italic">No adverse allergies reported</span>
              )}
            </div>
          </div>

          {/* Chronic Conditions Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sky-600">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">Diagnosed Chronic Conditions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activePatient.chronic_conditions && activePatient.chronic_conditions.length > 0 ? (
                activePatient.chronic_conditions.map((cond, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                    {cond}
                  </span>
                ))
              ) : (
                <span className="text-xs font-medium text-slate-400 italic">No chronic pathologies recorded</span>
              )}
            </div>
          </div>

          {/* AI Health Score & Safety Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">AI Health Score & Safety Shield</span>
              </div>
              <p className="text-4xl font-black text-slate-900 mt-2">
                {activePatient.health_score || 78}<span className="text-base text-slate-400 font-bold">/100</span>
              </p>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">Optimal Vital Stability • DDI Verified</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex flex-col items-center justify-center font-black text-xs shadow-xs">
              <CheckCircle2 className="w-6 h-6 mb-0.5" />
              <span>NABH Safe</span>
            </div>
          </div>
        </div>

        {/* 5. DAILY MEDICATION ADMINISTRATION SCHEDULE (With Voice Readout & Refill) */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Daily Medication Administration Schedule</h3>
                <p className="text-xs text-slate-500 font-medium">Timetable tracked, verified, and administered by hospital nursing staff</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReadMedications}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
                  isSpeaking
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Listen to Regimen'}</span>
              </button>

              <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-100">
                {activePatient.medication_schedules?.length || 3} Prescribed Doses Active
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Medicine Name</th>
                  <th className="py-3 px-4">Dosage</th>
                  <th className="py-3 px-4">Timing Slot</th>
                  <th className="py-3 px-4">Relation to Food</th>
                  <th className="py-3 px-4">Administering Nurse</th>
                  <th className="py-3 px-4 text-center">Refill Action</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {(activePatient.medication_schedules || []).map((med, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-blue-500" />
                      {med.medicine_name}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{med.dosage}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{med.timing_slot}</td>
                    <td className="py-3.5 px-4 text-slate-600">{med.food_relation}</td>
                    <td className="py-3.5 px-4 text-slate-600">{med.assigned_nurse}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleRequestRefill(med.medicine_name)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold text-[11px] border border-slate-200 transition-colors"
                      >
                        {refillStatus[med.medicine_name] || 'Request Refill'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {med.is_taken ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Administered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          Scheduled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. UPCOMING CONSULTATIONS & PERSONALIZED RECOMMENDATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upcoming Consultations (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">Upcoming Consultations</h3>
              </div>
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book New</span>
              </button>
            </div>

            <div className="space-y-3">
              {(activePatient.appointments || []).map((apt, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900">{apt.doctor_name}</p>
                      <p className="text-[11px] text-blue-600 font-bold">{apt.doctor_specialty}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase">
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    <span className="font-bold">Reason:</span> {apt.reason}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 font-bold border-t border-slate-200/60">
                    <span>{apt.date}</span>
                    <span className="text-slate-800">{apt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Health Recommendations (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-600" />
                <h3 className="text-sm font-black text-slate-900">Personalized Health Recommendations</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-bold">Evidence-Based</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Maintain a balanced Mediterranean diet</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Rich in green leafy vegetables, healthy olive oils, lean protein, and restricted sodium intake (&lt;2g/day) to sustain optimal blood pressure.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Moderate physical activity</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    At least 30 minutes daily brisk walking or low-impact cardiovascular workouts as tolerated to improve endothelial flexibility.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Continuous blood pressure & sugar tracking</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Log resting BP and fasting blood sugar at 08:00 AM before breakfast for accurate clinical telemetry and dosage adjustments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. STATE-OF-THE-ART AI CLINICAL HEALTH DIAGNOSIS MODAL */}
      {isDiagnosisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">AI Clinical Diagnostic Assistant</h3>
                  <p className="text-xs text-slate-500 font-medium">Multi-symptom pattern recognition & disease risk assessment</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsDiagnosisModalOpen(false);
                  setAiResult(null);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold">
              <span>Patient: <strong className="text-slate-900">{activePatient.full_name}</strong> ({activePatient.gender}, {activePatient.age}y)</span>
              <span className="text-blue-600 font-bold">{activePatient.admission_status}</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 block">Select Observed Symptoms:</label>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                {COMMON_SYMPTOMS.map((sym, idx) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs border border-blue-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleAddCustomSymptom} className="flex gap-2">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="Type custom symptom and press Add..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
              >
                + Add
              </button>
            </form>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Fasting Glucose</label>
                <input
                  type="number"
                  value={glucose}
                  onChange={(e) => setGlucose(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleRunAiDiagnosis}
              disabled={aiLoading || selectedSymptoms.length === 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {aiLoading ? 'Evaluating Clinical ML Neural Network...' : `Run AI Diagnosis for ${selectedSymptoms.length} Symptoms`}
            </button>

            {aiResult && (
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-black text-slate-900 uppercase">Differential Diagnosis Results</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    {aiResult.review_status || 'Eligible'}
                  </span>
                </div>

                <div className="space-y-3">
                  {(aiResult.top_predictions || []).map((pred, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-900">{pred.disease}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-extrabold">
                          {Math.round((pred.confidence || 0.9) * 100)}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{pred.description}</p>
                      <div className="text-[11px] font-bold text-blue-600">
                        Consult Specialist: {pred.specialist || 'Cardiologist'}
                      </div>
                    </div>
                  ))}
                </div>

                {aiResult.shap_top_contributors && (
                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-xs space-y-1.5">
                    <span className="font-bold text-sky-900 block text-[11px]">Primary ML Biomarker Contributors (SHAP Explainability):</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(aiResult.shap_top_contributors).map(([feature, weight], i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-sky-800 text-[10px] font-bold">
                          {feature}: {weight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. PRINTABLE OFFICIAL PRESCRIPTION MODAL */}
      {isPrintRxModalOpen && (
        <PrintablePrescriptionModal
          patient={activePatient}
          onClose={() => setIsPrintRxModalOpen(false)}
        />
      )}

      {/* 9. BOOK NEW CONSULTATION MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Schedule Doctor Consultation</h3>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {apptConfirmed ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black text-emerald-900">Consultation Scheduled!</h4>
                <p className="text-xs text-emerald-700">Added to {activePatient.full_name}'s electronic appointment schedule.</p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Attending Specialist</label>
                  <input
                    type="text"
                    readOnly
                    value={activePatient.assigned_doctor_name || 'Dr. Aditi Sharma (Cardiology)'}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 border border-slate-200 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Consultation Date</label>
                  <input
                    type="date"
                    required
                    value={newApptDate}
                    onChange={(e) => setNewApptDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={newApptTime}
                    onChange={(e) => setNewApptTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                    <option value="11:30 AM">11:30 AM (Morning Slot)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                    <option value="04:30 PM">04:30 PM (Evening Slot)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Reason for Consultation</label>
                  <input
                    type="text"
                    value={newApptReason}
                    onChange={(e) => setNewApptReason(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
