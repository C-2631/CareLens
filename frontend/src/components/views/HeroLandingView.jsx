import React, { useState, useRef } from 'react';
import {
  HeartPulse, Shield, Sparkles, Activity, Users, Stethoscope, ArrowRight,
  CheckCircle2, Clock, MapPin, Phone, Mail, Award, Building2, Bed,
  Syringe, Pill, Star, ChevronRight, Check, Send, AlertCircle, Calendar, X,
  Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, MonitorPlay
} from 'lucide-react';
import VideoBackground from '../common/VideoBackground';

export default function HeroLandingView({ onOpenAuth, setActiveTab, onSelectPatient }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isVideoShowcasePlaying, setIsVideoShowcasePlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoShowcaseRef = useRef(null);
  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    phone: '',
    email: '',
    department: 'Cardiology & Heart Care',
    doctorName: 'Dr. Aditi Sharma',
    appointmentDate: '',
    appointmentTime: '10:30 AM',
    reason: ''
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState(null);

  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'Cardiology',
    preferredDoctor: 'Dr. Aditi Sharma',
    date: '',
    message: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const specialists = [
    {
      id: 'doc-001',
      name: 'Dr. Aditi Sharma',
      role: 'Senior Cardiologist & Chief of Medicine',
      dept: 'Cardiology & Heart Care',
      qualification: 'MD, DM (Cardiology), FACC',
      experience: '16+ Years Experience',
      rating: 4.9,
      opd: '09:00 AM - 02:00 PM',
      color: 'from-blue-600 to-cyan-600',
      initials: 'AS'
    },
    {
      id: 'doc-002',
      name: 'Dr. Rajesh Kumar',
      role: 'Chief Diabetologist & Endocrinologist',
      dept: 'Endocrinology & Metabolism',
      qualification: 'MD, DNB (Endocrinology)',
      experience: '14+ Years Experience',
      rating: 4.9,
      opd: '10:00 AM - 03:00 PM',
      color: 'from-cyan-600 to-teal-600',
      initials: 'RK'
    },
    {
      id: 'doc-003',
      name: 'Dr. Priya Nair',
      role: 'Head of Pulmonology & Critical Care',
      dept: 'Pulmonology & Respiratory Medicine',
      qualification: 'MD (Chest), FCCP',
      experience: '12+ Years Experience',
      rating: 4.8,
      opd: '09:30 AM - 02:30 PM',
      color: 'from-emerald-600 to-teal-600',
      initials: 'PN'
    },
    {
      id: 'doc-004',
      name: 'Dr. Vikram Malhotra',
      role: 'Lead Neurosurgeon & Stroke Specialist',
      dept: 'Neurology & Neurosurgery',
      qualification: 'MCh (Neurosurgery), FAANS',
      experience: '18+ Years Experience',
      rating: 5.0,
      opd: '11:00 AM - 04:00 PM',
      color: 'from-violet-600 to-indigo-600',
      initials: 'VM'
    },
    {
      id: 'doc-005',
      name: 'Dr. Sunita Mehra',
      role: 'Director of Medical Oncology',
      dept: 'Comprehensive Cancer Center',
      qualification: 'MD, DM (Medical Oncology)',
      experience: '15+ Years Experience',
      rating: 4.9,
      opd: '08:30 AM - 01:30 PM',
      color: 'from-rose-600 to-pink-600',
      initials: 'SM'
    },
    {
      id: 'doc-006',
      name: 'Dr. Devendra Kapoor',
      role: 'Chief Orthopedic & Joint Surgeon',
      dept: 'Orthopedics & Sports Medicine',
      qualification: 'MS (Ortho), MCh (Joint Recon)',
      experience: '17+ Years Experience',
      rating: 4.9,
      opd: '10:00 AM - 03:30 PM',
      color: 'from-amber-600 to-orange-600',
      initials: 'DK'
    }
  ];

  const medicalDepartments = [
    {
      name: 'Cardiology & Vascular Center',
      desc: 'Advanced ECG telemetry, cardiac catheterization, coronary stenting, and AI arrhythmia screening.',
      icon: HeartPulse,
      patients: '280+ Active Patients',
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      name: 'Endocrinology & Diabetology',
      desc: 'Precision glycemic index profiling, automated insulin titration, and lipid metabolic risk stratifiers.',
      icon: Activity,
      patients: '220+ Active Patients',
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100'
    },
    {
      name: 'Pulmonology & Respiratory Care',
      desc: 'Spirometry analysis, asthma rehabilitation, COPD management, and non-invasive high-flow oxygen suites.',
      icon: Sparkles,
      patients: '180+ Active Patients',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      name: 'Neurology & Stroke Center',
      desc: 'Comprehensive EEG, neuro-rehabilitation, stroke rapid response, and cognitive health analytics.',
      icon: Award,
      patients: '120+ Active Patients',
      color: 'text-violet-600 bg-violet-50 border-violet-100'
    },
    {
      name: 'Orthopedics & Joint Replacement',
      desc: 'Minimally invasive arthroscopy, computer-navigated total knee/hip replacement, and spine care.',
      icon: Building2,
      patients: '140+ Active Patients',
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      name: 'Comprehensive Cancer Center',
      desc: 'Multidisciplinary oncology tumor boards, precision chemotherapy suites, and targeted immunotherapies.',
      icon: Shield,
      patients: '95+ Active Patients',
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    }
  ];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.patientName || !bookingForm.phone) return;

    const refCode = `APT-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedDetails({
      ...bookingForm,
      refCode,
      date: bookingForm.appointmentDate || 'Tomorrow',
      time: bookingForm.appointmentTime
    });
    setBookingConfirmed(true);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.fullName || !inquiryForm.email) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryForm({
        fullName: '',
        email: '',
        phone: '',
        department: 'Cardiology',
        preferredDoctor: 'Dr. Aditi Sharma',
        date: '',
        message: ''
      });
    }, 4000);
  };

  const toggleShowcasePlay = () => {
    if (videoShowcaseRef.current) {
      if (isVideoShowcasePlaying) {
        videoShowcaseRef.current.pause();
      } else {
        videoShowcaseRef.current.play();
      }
      setIsVideoShowcasePlaying(!isVideoShowcasePlaying);
    }
  };

  const toggleShowcaseMute = () => {
    if (videoShowcaseRef.current) {
      videoShowcaseRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const restartShowcase = () => {
    if (videoShowcaseRef.current) {
      videoShowcaseRef.current.currentTime = 0;
      videoShowcaseRef.current.play();
      setIsVideoShowcasePlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (videoShowcaseRef.current) {
      if (videoShowcaseRef.current.requestFullscreen) {
        videoShowcaseRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 w-full overflow-x-hidden">
      {/* 1. HERO SECTION WITH CONTINUOUS VIDEO BACKGROUND */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-6 sm:px-10 lg:px-16 2xl:px-24">
        <VideoBackground overlayClass="bg-white/80 backdrop-blur-xs" />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center space-y-8 animate-fadeIn">
          {/* Clinical Intelligence Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-black shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>AI-DRIVEN PRECISION HEALTHCARE & HOSPITAL INTELLIGENCE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-slate-900 tracking-tight leading-tight max-w-5xl">
            Personalized Medical Care,{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600">
              Powered by Clinical AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg xl:text-xl text-slate-600 font-medium max-w-3xl leading-relaxed">
            Real-time diagnostic intelligence for patients, unified medication & surgical workflows for doctors & nurses, and 360° enterprise visibility for hospital administrators.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 border-2 border-white/50"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Doctor Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border-2 border-slate-200 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5 text-blue-600" />
              <span>Explore Patient Health Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('doctor-platform')}
              className="px-8 py-4 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-extrabold text-sm border-2 border-cyan-200 shadow-md transition-all flex items-center gap-2"
            >
              <Stethoscope className="w-5 h-5 text-cyan-600" />
              <span>Doctor & Staff Station</span>
            </button>
          </div>

          {/* Live Hospital Telemetry Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 pt-8 w-full max-w-4xl border-t border-slate-200/80">
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-blue-600">1,000+</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5">Active Inpatients / Outpatients</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-cyan-600">180+</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5">Expert Specialist Doctors</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">96.8%</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5">Clinical Diagnostic Accuracy</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs">
              <p className="text-2xl sm:text-3xl font-black text-purple-600">24/7</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5">OT & Emergency Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PROJECT VIDEO SHOWCASE & ARCHITECTURE DEMONSTRATION */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 2xl:px-24 bg-gradient-to-b from-white via-slate-50 to-white border-y border-slate-200">
        <div className="w-full max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-black uppercase tracking-wider shadow-xs">
              <MonitorPlay className="w-4 h-4 text-cyan-600 animate-pulse" />
              <span>Live System Demonstration & Design Reference</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Intelligent Hospital Platform in Action
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Watch our complete full-stack clinical recommendation pipeline orchestrating multi-class disease risk assessment, personalized medication regimens, and enterprise hospital telemetry in continuous real-time loop.
            </p>
          </div>

          {/* Video Showcase Card */}
          <div className="relative rounded-3xl bg-white p-3 sm:p-5 border-2 border-slate-200/90 shadow-2xl shadow-blue-500/5 group">
            {/* Top Video Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="font-mono font-black text-slate-800 uppercase tracking-wide">
                  CareLens Project Live Demonstration Feed
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-100/70 text-blue-800 font-bold text-[11px]">
                  1080p Full HD
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-100/70 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Looping Active</span>
                </span>
              </div>
            </div>

            {/* Video Player Element */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-inner flex items-center justify-center">
              <video
                ref={videoShowcaseRef}
                src="/videos/video_project.mp4"
                autoPlay
                loop
                muted={isVideoMuted}
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsVideoShowcasePlaying(true)}
                onPause={() => setIsVideoShowcasePlaying(false)}
              />

              {/* Bottom Video Floating Control Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-white shadow-xl">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleShowcasePlay}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md flex items-center gap-1.5 text-xs font-bold"
                  >
                    {isVideoShowcasePlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span className="hidden sm:inline">Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span className="hidden sm:inline">Play</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={toggleShowcaseMute}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all text-xs font-bold flex items-center gap-1.5"
                    title={isVideoMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isVideoMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    <span className="hidden sm:inline">{isVideoMuted ? 'Muted' : 'Sound On'}</span>
                  </button>

                  <button
                    onClick={restartShowcase}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all text-xs font-bold flex items-center gap-1.5"
                    title="Restart Video from Start"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden md:inline">Restart</span>
                  </button>
                </div>

                {/* Chapter Highlights */}
                <div className="hidden lg:flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
                    🔬 AI Triage & SHAP
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
                    💊 DDI Safety Filter
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
                    📊 1,000 Patient Census
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
                    title="Fullscreen Mode"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Reference Feature Highlight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Multi-Model AI Diagnosis</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    Random Forest + XGBoost with 96.8% multi-class accuracy across 41 disease profiles with SHAP feature explainability.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Non-Bypass Safety Shield</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    Deterministic cross-verification against 104 active pharmacy compounds to eliminate Drug-Drug Interactions and allergen triggers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Hospital Master Directory</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    Synchronized 1,000-patient inpatient/outpatient census with 500 medical personnel (180 Doctors, 220 Nurses, 100 Staff).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CENTERS OF CLINICAL EXCELLENCE */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 2xl:px-24 bg-white border-y border-slate-200">
        <div className="w-full max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider">
              Specialized Hospital Departments
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              6 Centers of Clinical Excellence
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto">
              World-class clinical departments equipped with cutting-edge robotic surgical suites, continuous telemetry, and dedicated critical care teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalDepartments.map((dept, idx) => {
              const IconComp = dept.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-xs ${dept.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {dept.patients}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dept.desc}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setBookingForm(prev => ({ ...prev, department: dept.name }));
                        setIsBookingModalOpen(true);
                      }}
                      className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Book in this Department</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. TOP SPECIALIST PHYSICIANS & SURGEONS */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 2xl:px-24 bg-slate-50">
        <div className="w-full max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-black uppercase tracking-wider">
              Leading Medical Faculty
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Consult Top Specialists & Surgeons
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto">
              Our 180+ board-certified physicians, fellows, and surgeons provide compassionate, evidence-based care tailored to your biomarkers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map(doc => (
              <div
                key={doc.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${doc.color} text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0`}>
                    {doc.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-base font-black text-slate-900 truncate">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-blue-600 mt-0.5">{doc.role}</p>
                    <p className="text-[11px] text-slate-500">{doc.qualification}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">OPD Timings:</span>
                    <span className="font-bold text-slate-800">{doc.opd}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Experience:</span>
                    <span className="font-bold text-emerald-700">{doc.experience}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBookingForm(prev => ({ ...prev, doctorName: doc.name, department: doc.dept }));
                    setIsBookingModalOpen(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation with {doc.name.split(' ')[1]}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOSPITAL INFRASTRUCTURE & BENCHMARKS */}
      <section className="py-20 px-6 sm:px-10 lg:px-16 2xl:px-24 bg-white border-t border-slate-200">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider">
              Accredited Medical Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              NABH & JCI Accredited Precision Hospital Facility
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              CareLens operates a 650-bed multi-specialty tertiary care hospital with 24 dedicated Intensive Care Units (ICUs), 8 laminar-airflow modular Operation Theaters (OTs), and fully integrated clinical AI algorithms ensuring real-time patient monitoring.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  Zero Drug-Drug Interaction (DDI) & Allergy Non-Bypass Safety Shield
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  100% Verified Clinical Evidence Protocols adhering to WHO & ICMR Guidelines
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  Round-the-clock automated nurse medication administration and electronic sign-offs
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
            <h3 className="text-lg font-black text-slate-900">Hospital Patient Inquiry & Help Desk</h3>
            <p className="text-xs text-slate-500">Have a clinical question or need admission support? Our triage team responds within 15 minutes.</p>

            {inquirySubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black">Inquiry Successfully Transmitted!</h4>
                <p className="text-xs text-emerald-700">Our medical coordinator will contact you at {inquiryForm.phone || inquiryForm.email} shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.fullName}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Department / Clinical Inquiry</label>
                  <textarea
                    rows={2}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Briefly describe your symptoms or inquiry..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Clinical Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE APPOINTMENT BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Book Doctor Consultation</h3>
                  <p className="text-[11px] text-slate-500">CareLens Multi-Specialty Hospital Appointment</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsBookingModalOpen(false);
                  setBookingConfirmed(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="space-y-4 text-center py-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">Appointment Confirmed!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Booking Reference ID: <span className="font-mono font-black text-blue-600">{confirmedDetails.refCode}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient Name:</span>
                    <span className="font-bold text-slate-800">{confirmedDetails.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor:</span>
                    <span className="font-bold text-blue-600">{confirmedDetails.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-bold text-slate-800">{confirmedDetails.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Schedule:</span>
                    <span className="font-bold text-emerald-700">{confirmedDetails.date} at {confirmedDetails.time}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setBookingConfirmed(false);
                      setActiveTab('dashboard');
                    }}
                    className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-sm"
                  >
                    Go to Patient Portal
                  </button>
                  <button
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setBookingConfirmed(false);
                    }}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.patientName}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Specialist Doctor</label>
                  <select
                    value={bookingForm.doctorName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, doctorName: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    {specialists.map(doc => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name} — {doc.dept} ({doc.opd})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.appointmentDate}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Time Slot</label>
                    <select
                      value={bookingForm.appointmentTime}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, appointmentTime: e.target.value }))}
                      className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    >
                      <option value="09:30 AM">09:30 AM (Morning Slot)</option>
                      <option value="10:30 AM">10:30 AM (Morning Slot)</option>
                      <option value="11:30 AM">11:30 AM (Morning Slot)</option>
                      <option value="01:30 PM">01:30 PM (Afternoon Slot)</option>
                      <option value="03:00 PM">03:00 PM (Evening Slot)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Reason for Consultation / Symptoms</label>
                  <input
                    type="text"
                    value={bookingForm.reason}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g. Chest tightness, blood pressure follow-up, general review..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Consultation Booking</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
