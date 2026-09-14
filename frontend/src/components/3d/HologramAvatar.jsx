import React, { useState } from 'react';
import { Heart, Activity, Shield, Droplet, Wind, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function HologramAvatar({ organStatuses = {}, interactive = true, activeOrgan = null, onSelectOrgan = () => {} }) {
  const { isDark } = useTheme();
  const [hoveredOrgan, setHoveredOrgan] = useState(null);

  const organs = [
    {
      id: 'heart',
      name: 'Heart',
      status: organStatuses.heart || 'Normal',
      top: '32%',
      left: '49%',
      color: '#ef4444',
      icon: Heart,
      detail: 'Resting HR 70-72 bpm. Sinus rhythm regular. Cardiovascular pressure stable.'
    },
    {
      id: 'lungs',
      name: 'Lungs',
      status: organStatuses.lungs || 'Normal',
      top: '28%',
      left: '38%',
      color: '#38bdf8',
      icon: Wind,
      detail: 'Clear bilateral air entry. Normal respiratory rate (16 bpm), SpO2 99%.'
    },
    {
      id: 'liver',
      name: 'Liver',
      status: organStatuses.liver || 'Normal',
      top: '42%',
      left: '42%',
      color: '#f59e0b',
      icon: Shield,
      detail: 'Bilirubin and transaminases within reference baseline. Good metabolic clearance.'
    },
    {
      id: 'kidneys',
      name: 'Kidneys',
      status: organStatuses.kidneys || 'Normal',
      top: '48%',
      left: '56%',
      color: '#8b5cf6',
      icon: Droplet,
      detail: 'Optimal glomerular filtration rate (eGFR > 90). Normal electrolyte hydration balance.'
    },
    {
      id: 'metabolism',
      name: 'Metabolism',
      status: organStatuses.metabolism || 'Needs Attention',
      top: '56%',
      left: '50%',
      color: '#f97316',
      icon: Zap,
      detail: 'Fasting glucose slightly elevated (104 mg/dL). Low-glycemic dietary adherence recommended.'
    }
  ];

  return (
    <div className="relative w-full h-[400px] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Background Holographic Glow & Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-3xl animate-pulse-slow" />
        <div className="absolute w-72 h-72 rounded-full border border-cyan-500/20 dark:border-cyan-400/30 animate-spin" style={{ animationDuration: '25s' }} />
        <div className="absolute w-84 h-84 rounded-full border border-dashed border-blue-500/20 dark:border-blue-400/20 animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
      </div>

      {/* Futuristic Vertical Scanning Bar */}
      <div className="absolute w-full max-w-[280px] h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 shadow-[0_0_12px_#22d3ee] animate-scan pointer-events-none z-20" />

      {/* SVG Holographic Human Body Silhouette */}
      <div className="relative z-10 w-[240px] h-[340px] flex items-center justify-center">
        <svg
          viewBox="0 0 200 320"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Silhouette Body Mesh */}
          <path
            d="M 100 25 C 108 25, 114 32, 114 42 C 114 52, 108 58, 100 58 C 92 58, 86 52, 86 42 C 86 32, 92 25, 100 25 Z"
            className="fill-cyan-500/20 stroke-cyan-400"
            strokeWidth="1.5"
          />
          {/* Torso & Neck */}
          <path
            d="M 94 58 L 106 58 L 126 75 L 138 120 L 132 170 L 118 190 L 118 240 L 112 305 L 98 305 L 100 240 L 100 190 L 82 190 L 68 170 L 62 120 L 74 75 Z"
            className="fill-cyan-500/10 stroke-cyan-400/80"
            strokeWidth="1.2"
          />
          {/* Arms */}
          <path
            d="M 74 75 L 45 130 L 35 190 L 42 195 L 54 135 L 68 95"
            className="stroke-cyan-400/60"
            strokeWidth="1.2"
          />
          <path
            d="M 126 75 L 155 130 L 165 190 L 158 195 L 146 135 L 132 95"
            className="stroke-cyan-400/60"
            strokeWidth="1.2"
          />
          {/* Neural & Vascular Nodes Pattern */}
          <line x1="100" y1="58" x2="100" y2="185" className="stroke-cyan-300/40" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="80" y1="95" x2="120" y2="95" className="stroke-cyan-300/40" strokeWidth="0.8" />
          <line x1="75" y1="125" x2="125" y2="125" className="stroke-cyan-300/40" strokeWidth="0.8" />
          <line x1="80" y1="155" x2="120" y2="155" className="stroke-cyan-300/40" strokeWidth="0.8" />
          <circle cx="100" cy="102" r="8" className="fill-red-500/40 stroke-red-400 animate-pulse" strokeWidth="1.5" />
          <circle cx="85" cy="98" r="6" className="fill-sky-400/30 stroke-sky-400" strokeWidth="1" />
          <circle cx="115" cy="98" r="6" className="fill-sky-400/30 stroke-sky-400" strokeWidth="1" />
          <circle cx="92" cy="132" r="7" className="fill-amber-400/30 stroke-amber-400" strokeWidth="1" />
          <circle cx="108" cy="148" r="6" className="fill-purple-400/30 stroke-purple-400" strokeWidth="1" />
        </svg>

        {/* Interactive Organ Hotspots */}
        {interactive && organs.map((organ) => {
          const isSelected = activeOrgan === organ.id;
          const isHovered = hoveredOrgan === organ.id;
          const isWarning = organ.status.toLowerCase().includes('attention') || organ.status.toLowerCase().includes('high');

          return (
            <div
              key={organ.id}
              style={{ top: organ.top, left: organ.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
              onMouseEnter={() => setHoveredOrgan(organ.id)}
              onMouseLeave={() => setHoveredOrgan(null)}
              onClick={() => onSelectOrgan(organ.id)}
            >
              {/* Pulse Ring */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isSelected || isHovered ? 'scale-125' : 'scale-100'
                }`}
                style={{
                  backgroundColor: isWarning ? 'rgba(249, 115, 22, 0.25)' : 'rgba(34, 211, 238, 0.25)',
                  boxShadow: `0 0 12px ${isWarning ? '#f97316' : '#22d3ee'}`
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: isWarning ? '#f97316' : '#22d3ee'
                  }}
                />
              </div>

              {/* Tooltip on Hover */}
              {(isHovered || isSelected) && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 p-2.5 rounded-xl bg-slate-900/95 text-white text-xs shadow-2xl border border-cyan-500/40 backdrop-blur-md z-40 animate-fadeIn pointer-events-none">
                  <div className="flex items-center justify-between font-semibold text-cyan-300 mb-1">
                    <span>{organ.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {organ.status}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{organ.detail}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Holographic Glowing Base Pedestal */}
      <div className="relative -mt-6 z-0 flex flex-col items-center">
        <div className="w-48 h-8 rounded-[100%] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent blur-[2px] border-t border-cyan-400/80 shadow-[0_-4px_18px_#06b6d4]" />
        <div className="w-36 h-4 rounded-[100%] bg-cyan-400/20 blur-md -mt-3" />
      </div>
    </div>
  );
}
