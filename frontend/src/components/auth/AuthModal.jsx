import React, { useState } from 'react';
import {
  HeartPulse, Shield, User, Stethoscope, Building2, Eye, EyeOff,
  CheckCircle2, AlertCircle, ArrowRight, Lock, Mail, Sparkles, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose, defaultRole = 'patient' }) {
  const { login } = useAuth();
  const [activePortal, setActivePortal] = useState(defaultRole);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('patient@carelens.ai');
  const [password, setPassword] = useState('Patient@123');
  const [fullName, setFullName] = useState('Priya Sharma');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePortalSwitch = (portal) => {
    setActivePortal(portal);
    setError('');
    if (portal === 'patient') {
      setEmail('patient@carelens.ai');
      setPassword('Patient@123');
      setFullName('Priya Sharma');
    } else if (portal === 'doctor') {
      setEmail('doctor@carelens.ai');
      setPassword('Doctor@123');
      setFullName('Dr. Aditi Sharma');
    } else if (portal === 'admin') {
      setEmail('admin@carelens.ai');
      setPassword('Admin@123');
      setFullName('Administrator');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <HeartPulse className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              CareLens <span className="text-cyan-600 font-extrabold">HealthAI</span>
            </h2>
            <p className="text-xs text-slate-500">Select your authorized medical platform portal</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => handlePortalSwitch('patient')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activePortal === 'patient'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patient</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('doctor')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activePortal === 'doctor'
                ? 'bg-white text-cyan-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor / Staff</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('admin')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activePortal === 'admin'
                ? 'bg-white text-purple-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        <div className={`p-3 rounded-2xl text-xs flex items-center gap-2.5 ${
          activePortal === 'patient' ? 'bg-blue-50 text-blue-800 border border-blue-100' :
          activePortal === 'doctor' ? 'bg-cyan-50 text-cyan-800 border border-cyan-100' :
          'bg-purple-50 text-purple-800 border border-purple-100'
        }`}>
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>
            {activePortal === 'patient' && 'Access personal EHR, live vitals, medication schedule & AI symptom checker.'}
            {activePortal === 'doctor' && 'Access clinician triage queue, nurse medication timetable & OT surgeries.'}
            {activePortal === 'admin' && 'Access 1,000 patient census, 500 workforce directory & 104 pharmacy inventory.'}
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isRegister && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hospital.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-extrabold shadow-md transition-all flex items-center justify-center gap-2 ${
              activePortal === 'patient' ? 'bg-blue-600 hover:bg-blue-700' :
              activePortal === 'doctor' ? 'bg-cyan-600 hover:bg-cyan-700' :
              'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <span>{isRegister ? 'Create Account & Sign In' : `Sign In to ${activePortal.toUpperCase()} Portal`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {isRegister ? 'Already registered?' : "Need a new account?"}
          </span>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="font-bold text-blue-600 hover:text-blue-800"
          >
            {isRegister ? 'Sign In Instead' : 'Register New Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
