import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, X, Send, Sparkles, User, RefreshCw, MessageSquare,
  Activity, Heart, Pill, Dumbbell, Utensils, ChevronRight, Mic, Volume2
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function FloatingHealthAIAssistant({ onNavigateTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your CareLens HealthAI Clinical Assistant. Ask me about your health score, medication interactions, symptom analysis, dietary plans, or clinical guidelines."
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chips, setChips] = useState([
    'What are my health risks?',
    'Suggest a balanced diet',
    'Explain Metformin & BP dosage',
    'Daily exercise recommendations'
  ]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.askChatAssistant(newMessages, {
        patient_name: user?.full_name || 'Priya Sharma',
        role: user?.role || 'patient',
        health_score: 78
      });

      setMessages([...newMessages, { role: 'assistant', content: res.reply }]);
      if (res.suggested_chips && res.suggested_chips.length > 0) {
        setChips(res.suggested_chips);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: "I have analyzed your query based on CareLens clinical protocols. For personalized diagnosis, please consult your assigned specialist Dr. Aditi Sharma or use the AI Health Diagnosis tool."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 group border-2 border-white/80"
          title="Open CareLens HealthAI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-black tracking-wide pr-1">AI Health Assistant</span>
        </button>
      )}

      {/* Floating Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 sm:w-[420px] max-h-[620px] h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black">CareLens HealthAI</h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-400 text-emerald-950 text-[9px] font-extrabold uppercase">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-blue-100">Decision-Support Clinical Chat</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Context Strip */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-semibold">Context: <span className="font-bold text-blue-600">{user?.full_name || 'Priya Sharma'}</span></span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              Health Score: 78/100
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[82%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 rounded-bl-xs shadow-xs text-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Consulting medical knowledge base...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Question Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-colors flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-xl border transition-colors ${
                isListening ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask HealthAI anything..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />

            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
