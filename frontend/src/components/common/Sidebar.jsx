import React from 'react';
import {
  LayoutDashboard, Users, Stethoscope, Building2, Pill, Activity,
  Sparkles, Calendar, FileText, Settings, ShieldCheck, HelpCircle, HeartPulse
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuth();

  const navigationItems = [
    {
      id: 'hero',
      label: 'Home & Hospital Landing',
      icon: HeartPulse,
      badge: 'Main',
      color: 'text-blue-600'
    },
    {
      id: 'dashboard',
      label: 'Patient Health Portal',
      icon: Users,
      badge: '10 Profiles',
      color: 'text-blue-600'
    },
    {
      id: 'doctor-platform',
      label: 'Doctor & Nurse Station',
      icon: Stethoscope,
      badge: '20 Surgeries',
      color: 'text-cyan-600'
    },
    {
      id: 'admin-platform',
      label: 'Hospital Admin Console',
      icon: Building2,
      badge: '1000 Patients',
      color: 'text-purple-600'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
            Main Medical Platforms
          </span>
          <div className="space-y-1">
            {navigationItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 text-xs">
          <div className="flex items-center gap-2 text-sky-900 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>NABH & HIPAA Compliant</span>
          </div>
          <p className="text-[11px] text-sky-700 leading-relaxed">
            Continuous vital telemetry and zero drug-drug interaction safety shield enabled.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-600">CareLens AI Hospital Platform</p>
        <p>Production v2.6.4 • Light Theme</p>
      </div>
    </aside>
  );
}
