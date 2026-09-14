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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-300 cursor-pointer select-none ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Soft Glow Circles */}
      <div className="absolute w-96 h-96 rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
      <div className="absolute w-80 h-80 rounded-full bg-cyan-500/15 blur-[100px] animate-pulse-slow" />

      {/* Center Icon & Pulse Radar */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] shadow-[0_0_40px_rgba(6,182,212,0.5)]">
          <div className="w-full h-full bg-slate-900/90 rounded-[22px] flex items-center justify-center backdrop-blur-xl">
            <HeartPulse className="w-12 h-12 text-cyan-400 animate-bounce" />
          </div>
        </div>

        {/* Pulse Radar Rings */}
        <div className="absolute -inset-4 rounded-full border border-cyan-400/30 animate-ping opacity-40" style={{ animationDuration: '2.5s' }} />
        <div className="absolute -inset-8 rounded-full border border-blue-500/20 animate-ping opacity-20" style={{ animationDuration: '3.5s' }} />
      </div>

      {/* Brand Title */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            CareLens
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold tracking-wider uppercase">
            AI Healthcare
          </span>
        </div>
        <p className="text-sm text-slate-400 font-medium">
          Personalized Healthcare & Medicine Recommendation System
        </p>
      </div>

      {/* Progress Bar & Status Text */}
      <div className="w-64 max-w-xs">
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-200 rounded-full shadow-[0_0_10px_#22d3ee]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Initializing Clinical AI Models...
          </span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="absolute bottom-8 flex items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Deterministic Safety Verified
        </span>
        <span>•</span>
        <span>41 Disease Diagnostic Engine</span>
        <span>•</span>
        <span>Zero Hallucination Grounding</span>
      </div>
    </div>
  );
}
