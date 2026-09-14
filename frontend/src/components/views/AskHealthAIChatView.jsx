import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Send, Sparkles, User, CheckCircle2, ChevronRight,
  Activity, Heart, Utensils, Dumbbell, ShieldCheck, RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AskHealthAIChatView({ onNavigateTab }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your CareLens HealthAI Assistant. I can help explain your health score, discuss dietary recommendations, explore evidence-based medications, or answer clinical questions about your wellness plan. How can I help you today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chips, setChips] = useState([
    'What are my health risks?',
    'Suggest a diet plan',
    'What medicines are right for me?',
    'Recommended daily exercises'
  ]);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    const res = await api.askChatAssistant(newMessages, {
      predicted_disease: 'Diabetes',
      risk_level: 'Low',
      health_score: 86
    });

    setMessages([...newMessages, { role: 'assistant', content: res.reply }]);
    if (res.suggested_chips) {
      setChips(res.suggested_chips);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Good Morning, {user?.full_name?.split(' ')[0] || 'Priya'}!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here's your personalized health summary & AI Clinical Companion.
        </p>
      </div>

      {/* Main Grid matching Panel 6 of reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Health Score Card + Top Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Your Health Score (Circular Badge) */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-md text-center flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Your Health Score
            </span>
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" style={{ animationDuration: '8s' }} />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white">86</span>
                <span className="text-[10px] text-slate-400 font-bold">/100</span>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Excellent
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Keep up the good work!
            </p>
          </div>

          {/* Card 2: Top Recommendations */}
          <div className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Top Recommendations
              </h3>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                Daily Focus
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5">
                <Utensils className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Maintain your current diet</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Rich in fruits, vegetables and lean protein.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5">
                <Dumbbell className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Continue regular exercise</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">At least 30 minutes daily zone-2 walk.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Monitor vitamin D levels</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Slightly below optimal range.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('recommendations')}
              className="w-full mt-3 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-slate-800/80 hover:bg-blue-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
            >
              <span>View All Recommendations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: "Ask HealthAI" Chat Widget (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between min-h-[480px]">
          <div>
            {/* Chat Title */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ask HealthAI
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Your personal health assistant
                </span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="h-[280px] overflow-y-auto space-y-3 py-3 pr-1 scrollbar-thin">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    {msg.content.split('\n').map((para, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{para}</p>
                    ))}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse pl-9">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-500" />
                  HealthAI is reviewing medical guidelines...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Smart Chips */}
            <div className="flex flex-wrap gap-1.5 pt-2 pb-3">
              {chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-all text-slate-600 dark:text-slate-300"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 rounded-full bg-blue-600 dark:bg-cyan-500 text-white hover:bg-blue-700 dark:hover:bg-cyan-600 transition-all disabled:opacity-50 flex items-center justify-center shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
