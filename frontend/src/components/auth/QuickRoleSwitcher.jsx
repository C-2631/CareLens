import React from 'react';
import { User, Stethoscope, Building2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function QuickRoleSwitcher({ activeTab, setActiveTab }) {
  const { login } = useAuth();

  const handleFastSwitch = async (role, tabId) => {
    setActiveTab(tabId);
    if (role === 'patient') {
      try { await login('patient@carelens.ai', 'Patient@123'); } catch (e) {}
    } else if (role === 'doctor') {
      try { await login('doctor@carelens.ai', 'Doctor@123'); } catch (e) {}
    } else if (role === 'admin') {
      try { await login('admin@carelens.ai', 'Admin@123'); } catch (e) {}
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-xl flex items-center gap-1.5 text-xs">
      <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Fast Portal Access:</span>
      <button
        onClick={() => handleFastSwitch('patient', 'dashboard')}
        className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 ${
          activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <User className="w-3.5 h-3.5" />
        <span>Patient</span>
      </button>

      <button
        onClick={() => handleFastSwitch('doctor', 'doctor-platform')}
        className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 ${
          activeTab === 'doctor-platform' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Stethoscope className="w-3.5 h-3.5" />
        <span>Doctor / Staff</span>
      </button>

      <button
        onClick={() => handleFastSwitch('admin', 'admin-platform')}
        className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1.5 ${
          activeTab === 'admin-platform' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Building2 className="w-3.5 h-3.5" />
        <span>Hospital Admin</span>
      </button>
    </div>
  );
}
