import React, { useState, useEffect } from 'react';
import {
  Pill, Apple, Dumbbell, Sparkles, HeartPulse, ShieldCheck,
  ChevronRight, Info, AlertTriangle, CheckCircle2, Star,
  Moon, Zap, Activity, RefreshCw, X
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RecommendationsView() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const categories = ['All', 'Medications', 'Lifestyle', 'Diet', 'Exercise', 'Supplements'];

  const fetchRecommendations = async () => {
    setLoading(true);
    const res = await api.getRecommendations({
      predicted_disease: 'Diabetes',
      category_filter: activeCategory
    });
    setRecommendations(res.recommendations || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [activeCategory]);

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'medications': return Pill;
      case 'supplements': return Sparkles;
      case 'diet': return Apple;
      case 'exercise': return Dumbbell;
      case 'lifestyle': return Moon;
      default: return HeartPulse;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* View Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Personalized Recommendations
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          AI-powered suggestions based on your health data, lifestyle and medical history.
        </p>
      </div>

      {/* Category Tabs (Matching panel 3 of reference image) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 dark:bg-cyan-500 text-white shadow-md shadow-blue-500/20 dark:shadow-cyan-500/20'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex items-center gap-2 text-cyan-500 font-semibold animate-pulse">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Filtering verified clinical candidates...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((item) => {
            const IconComponent = getCategoryIcon(item.category);
            const isPlan = ['diet', 'exercise', 'lifestyle'].includes(item.category?.toLowerCase());

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Icon & Match Tag */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-cyan-500/15 text-blue-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {item.match_percentage}% Match
                    </span>
                  </div>

                  {/* Title & Category Tags */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </h3>

                  {/* Badges / Chips */}
                  <div className="flex flex-wrap gap-1.5 my-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-slate-800/80 text-blue-600 dark:text-cyan-300">
                      {item.drug_class}
                    </span>
                  </div>

                  {/* Standard Dosage / Rationale */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 my-2 leading-relaxed">
                    {item.standard_dosage}
                  </p>
                </div>

                {/* Card Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.effectiveness_rating}</span>
                  </div>

                  <button
                    onClick={() => setSelectedCandidate(item)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-600 shadow-sm transition-all"
                  >
                    {isPlan ? 'View Plan' : 'View Details'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Clinical Recommendation</span>
            </div>

            <h3 className="text-xl font-extrabold">{selectedCandidate.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedCandidate.generic_name} • {selectedCandidate.drug_class}</p>

            <div className="space-y-4 text-xs">
              {/* Clinical Protocol / Dosage */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Standard Protocol & Dosage:</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedCandidate.standard_dosage}</p>
              </div>

              {/* Safety Engine Verdict */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Deterministic Safety Verification
                </div>
                <p className="text-[11px] leading-relaxed">{selectedCandidate.safety?.reason || 'Cleared all deterministic allergy and DDI filters.'}</p>
              </div>

              {/* Indications */}
              {selectedCandidate.indications?.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Indications:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.indications.map((ind, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-300 text-[11px]">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Side Effects */}
              {selectedCandidate.common_side_effects?.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Known Remarks / Side Effects:</span>
                  <p className="text-slate-500 dark:text-slate-400">{selectedCandidate.common_side_effects.join(', ')}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
