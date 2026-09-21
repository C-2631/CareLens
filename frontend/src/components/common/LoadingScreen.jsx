import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, Sparkles, HeartPulse } from 'lucide-react';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFade(true);
          setTimeout(() => {
            onFinish();
          }, 250);
          return 100;
        }
        return prev + 25;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-800 transition-opacity duration-300 cursor-pointer select-none ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Soft Glow Circles in Light Medical Palette */}
      <div className="absolute w-96 h-96 rounded-full bg-blue-100/60 blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-cyan-100/60 blur-[80px] animate-pulse pointer-events-none" />

      {/* Center Icon & Pulse Radar */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-[2px] shadow-xl shadow-cyan-500/20">
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center shadow-inner">
            <HeartPulse className="w-10 h-10 text-blue-600 animate-bounce" />
          </div>
        </div>

        {/* Pulse Radar Rings */}
        <div className="absolute -inset-3 rounded-full border border-cyan-400/40 animate-ping opacity-40" style={{ animationDuration: '2.5s' }} />
        <div className="absolute -inset-6 rounded-full border border-blue-400/20 animate-ping opacity-20" style={{ animationDuration: '3.5s' }} />
      </div>

      {/* Brand Title */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            CareLens
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold tracking-wider uppercase shadow-xs">
            AI Healthcare
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Personalized Healthcare & Medicine Recommendation System
        </p>
      </div>

      {/* Progress Bar & Status Text */}
      <div className="w-64 max-w-xs">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 transition-all duration-150 rounded-full shadow-xs"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-spin" />
            Initializing Clinical AI Models...
          </span>
          <span className="font-mono text-slate-600">{Math.min(progress, 100)}%</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="absolute bottom-6 flex items-center gap-4 text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Deterministic Safety Verified
        </span>
        <span>•</span>
        <span>41 Disease Diagnostic Engine</span>
        <span>•</span>
        <span>Multi-Model Decision Support</span>
      </div>
    </div>
  );
}
