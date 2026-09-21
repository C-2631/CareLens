import React, { useState, useEffect, useRef } from 'react';
import {
  HeartPulse, Search, Bell, User, LogOut, ShieldAlert,
  Stethoscope, Settings, ChevronDown, Check, Building2,
  Pill, Activity, Sparkles, Clock, X, ArrowRight, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SEARCHABLE_ITEMS = [
  // Patients
  { type: 'patient', id: 'pat-001', title: 'Priya Sharma', subtitle: 'Hypertension review & Cardiac evaluation (42F, OPD-102)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },
  { type: 'patient', id: 'pat-002', title: 'Rohit Verma', subtitle: 'Type 2 Diabetes glycemic optimization (58M, Ward A-12)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },
  { type: 'patient', id: 'pat-003', title: 'Ananya Singh', subtitle: 'Bronchial asthma flare & Spirometry (29F, OPD-104)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },
  { type: 'patient', id: 'pat-004', title: 'Vikram Patel', subtitle: 'Post-PTCA stent maintenance & Telemetry (63M, Ward A-04)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },
  { type: 'patient', id: 'pat-005', title: 'Neha Kapoor', subtitle: 'Rheumatoid arthritis inflammatory check (38F, OPD-106)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },
  { type: 'patient', id: 'pat-006', title: 'Rajesh Gupta', subtitle: 'Chronic GERD & Fatty Liver Grade 1 (51M, OPD-108)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },
  { type: 'patient', id: 'pat-007', title: 'Meera Nair', subtitle: 'Hypothyroidism & Metabolic review (34F, OPD-110)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },
  { type: 'patient', id: 'pat-008', title: 'Arun Joshi', subtitle: 'Chronic migraine & Tension headaches (45M, OPD-112)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },
  { type: 'patient', id: 'pat-009', title: 'Sunita Rao', subtitle: 'Osteoarthritis knee joint therapy (55F, Ward B-02)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },
  { type: 'patient', id: 'pat-010', title: 'Devendra Kumar', subtitle: 'Post-lumbar microdiscectomy rehab (47M, Post-Op 02)', tab: 'dashboard', icon: User, color: 'text-blue-600 bg-blue-50' },

  // Doctors
  { type: 'doctor', title: 'Dr. Aditi Sharma', subtitle: 'Senior Cardiologist & Chief of Medicine (OPD-102)', tab: 'doctor-platform', icon: Stethoscope, color: 'text-cyan-600 bg-cyan-50' },
  { type: 'doctor', title: 'Dr. Rajesh Kumar', subtitle: 'Chief Diabetologist & Endocrinologist (OPD-104)', tab: 'doctor-platform', icon: Stethoscope, color: 'text-cyan-600 bg-cyan-50' },
  { type: 'doctor', title: 'Dr. Priya Nair', subtitle: 'Head of Pulmonology & Critical Care (OPD-106)', tab: 'doctor-platform', icon: Stethoscope, color: 'text-cyan-600 bg-cyan-50' },
  { type: 'doctor', title: 'Dr. Devendra Kapoor', subtitle: 'Chief Orthopedic & Spine Surgeon (OPD-108)', tab: 'doctor-platform', icon: Stethoscope, color: 'text-cyan-600 bg-cyan-50' },
  { type: 'doctor', title: 'Dr. Vikram Malhotra', subtitle: 'Lead Neurosurgeon & Stroke Specialist (OPD-110)', tab: 'doctor-platform', icon: Stethoscope, color: 'text-cyan-600 bg-cyan-50' },

  // Medicines
  { type: 'medicine', title: 'Telmisartan 40mg', subtitle: 'Antihypertensive ARB • In Stock • $14.50', tab: 'admin-platform', icon: Pill, color: 'text-emerald-600 bg-emerald-50' },
  { type: 'medicine', title: 'Metformin HCl 500mg', subtitle: 'Biguanide Antidiabetic • In Stock • $8.20', tab: 'admin-platform', icon: Pill, color: 'text-emerald-600 bg-emerald-50' },
  { type: 'medicine', title: 'Atorvastatin 10mg', subtitle: 'HMG-CoA Reductase Inhibitor • In Stock • $12.00', tab: 'admin-platform', icon: Pill, color: 'text-emerald-600 bg-emerald-50' },
  { type: 'medicine', title: 'Clopidogrel 75mg', subtitle: 'Antiplatelet Cardio Drug • In Stock • $18.50', tab: 'admin-platform', icon: Pill, color: 'text-emerald-600 bg-emerald-50' },

  // Features
  { type: 'feature', title: 'AI Clinical Health Diagnosis', subtitle: 'Multi-symptom ML inference & differential diagnosis', tab: 'dashboard', icon: Sparkles, color: 'text-violet-600 bg-violet-50' },
  { type: 'feature', title: 'Operation Theater (OT) Timetable', subtitle: '20 scheduled surgeries across 4 OT suites', tab: 'doctor-platform', icon: Activity, color: 'text-cyan-600 bg-cyan-50' },
  { type: 'feature', title: 'Medication Administration Schedule', subtitle: 'Daily timetable tracked and signed off by nurses', tab: 'doctor-platform', icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
  { type: 'feature', title: 'Hospital 1,000 Patient Master Census', subtitle: 'Paginated patient directory with risk filters & reassignment', tab: 'admin-platform', icon: Building2, color: 'text-purple-600 bg-purple-50' },
  { type: 'feature', title: 'Workforce Directory (500 Staff & Sweepers)', subtitle: '180 Doctors, 220 Nurses, 100 Staff & Sweepers', tab: 'admin-platform', icon: Building2, color: 'text-purple-600 bg-purple-50' }
];

export default function Navbar({ onOpenAuth, activeTab, setActiveTab, onSelectPatient }) {
  const { user, logout, isDoctor, isAdmin, isPatient, isNurse } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? SEARCHABLE_ITEMS.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (item) => {
    setActiveTab(item.tab);
    if (item.type === 'patient' && item.id && onSelectPatient) {
      onSelectPatient(item.id);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const roleBadge = () => {
    if (isAdmin) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5 shadow-xs">
          <Building2 className="w-3.5 h-3.5" />
          Hospital Admin
        </span>
      );
    }
    if (isDoctor) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1.5 shadow-xs">
          <Stethoscope className="w-3.5 h-3.5" />
          Doctor Station
        </span>
      );
    }
    if (isNurse) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-xs">
          <Stethoscope className="w-3.5 h-3.5" />
          Staff / Nurse
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 shadow-xs">
        <User className="w-3.5 h-3.5" />
        Patient Portal
      </span>
    );
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-14">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
            onClick={() => setActiveTab('hero')}
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
              <HeartPulse className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-blue-600 leading-tight">
                CareLens <span className="text-cyan-600 font-extrabold">HealthAI</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Enterprise Hospital Intelligence
              </span>
            </div>
          </div>

          {/* Primary View Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('recommendation-studio')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'recommendation-studio'
                  ? 'text-blue-700 font-black bg-blue-50 border border-blue-200 shadow-xs'
                  : 'hover:text-blue-600 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>AI Recommendation Studio</span>
              <span className="px-1.5 py-0.2 rounded-md bg-blue-600 text-white font-mono text-[9px] font-black">AI</span>
            </button>

            <button
              onClick={() => setActiveTab('what-if-simulator')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'what-if-simulator'
                  ? 'text-cyan-800 font-black bg-cyan-50 border border-cyan-200 shadow-xs'
                  : 'hover:text-cyan-600 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-600" />
              <span>What-If Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === 'hero' ? 'text-slate-900 font-black bg-slate-100 border border-slate-200' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === 'dashboard' ? 'text-blue-600 font-black bg-blue-50 border border-blue-100' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Patient Portal
            </button>

            <button
              onClick={() => setActiveTab('doctor-platform')}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === 'doctor-platform' ? 'text-cyan-700 font-black bg-cyan-50 border border-cyan-100' : 'hover:text-cyan-600 hover:bg-slate-50'
              }`}
            >
              Clinician Station
            </button>

            <button
              onClick={() => setActiveTab('admin-platform')}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === 'admin-platform' ? 'text-purple-700 font-black bg-purple-50 border border-purple-100' : 'hover:text-purple-600 hover:bg-slate-50'
              }`}
            >
              Admin Console
            </button>
          </div>

          {/* Active Global Hospital Omni-Search */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Global search: patients, doctors, medicines, surgeries..."
                className="w-full pl-9 pr-8 py-2 text-xs font-medium rounded-full bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 max-h-96 overflow-y-auto animate-fadeIn">
                <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Search Matches ({searchResults.length})</span>
                  <span>Click to Navigate</span>
                </div>

                <div className="divide-y divide-slate-50">
                  {searchResults.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full px-3.5 py-2.5 hover:bg-slate-50 text-left flex items-start gap-3 transition-colors group"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </p>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Role Badges & Profile Dropdown */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:block">
              {roleBadge()}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize font-medium">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold capitalize">
                        Role: {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { setActiveTab('dashboard'); setProfileOpen(false); }}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                      >
                        <User className="w-4 h-4 text-blue-500" />
                        Patient Health Portal
                      </button>

                      <button
                        onClick={() => { setActiveTab('doctor-platform'); setProfileOpen(false); }}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                      >
                        <Stethoscope className="w-4 h-4 text-cyan-500" />
                        Clinician & Nurse Station
                      </button>

                      <button
                        onClick={() => { setActiveTab('admin-platform'); setProfileOpen(false); }}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-medium"
                      >
                        <Building2 className="w-4 h-4 text-purple-500" />
                        Hospital Admin Console
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
