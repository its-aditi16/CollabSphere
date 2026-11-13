import React, { useState, useEffect, useRef } from 'react';
import { MessageSquareCode, Send, X, Bot, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import useDashboardStore from '../store/dashboardStore';
import useAIStore from '../store/aiStore';

const FloatingBot = () => {
  const { isBotOpen, setBotOpen, toggleBot } = useDashboardStore();
  const { messages, isLoading, askAI, clearMessages } = useAIStore();
  const { projectId } = useParams();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const query = input;
    setInput('');
    await askAI(projectId || 'general', query);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isBotOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            className="absolute bottom-20 right-0 w-[420px] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-indigo-600 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-indigo-800">
              <div className="flex items-center gap-2 text-white">
                <Sparkles size={18} className="animate-pulse" />
                <div className="flex flex-col">
                  <span className="font-bold leading-none">CollabSphere AI</span>
                  {projectId && <span className="text-[10px] opacity-70">Context: {projectId}</span>}
                </div>
              </div>
              <button
                onClick={() => setBotOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 h-96 p-4 space-y-4 overflow-y-auto bg-slate-950/20 custom-scrollbar"
            >
              {messages.length === 0 && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none text-slate-200 text-sm leading-relaxed shadow-sm">
                    Hello! I'm your AI collaboration assistant. How can I help you build faster today?
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-slate-700' : 
                    msg.role === 'system' ? 'bg-red-900/50' : 'bg-indigo-600'
                  }`}>
                    {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={18} className="text-white" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : msg.role === 'system'
                        ? 'bg-red-900/20 text-red-200 border border-red-900/50'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask CollabSphere AI..."
                  className="flex-1 bg-transparent px-3 py-2 text-white text-sm focus:outline-none"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleBot}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-4 rounded-full shadow-2xl transition-all relative ${
          isBotOpen ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white hover:shadow-indigo-500/20'
        }`}
      >
        {isBotOpen ? <X size={28} /> : <Bot size={28} />}
        {!isBotOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingBot;
