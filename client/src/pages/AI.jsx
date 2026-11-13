import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const AIPlaceholder = () => (
  <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl text-center">
    <div className="p-6 bg-slate-900 rounded-full mb-6 border border-slate-800 shadow-xl relative">
      <Bot size={48} className="text-indigo-500" />
      <Sparkles size={20} className="text-amber-400 absolute top-4 right-4 animate-pulse" />
    </div>
    <h1 className="text-3xl font-bold text-white mb-2">AI Assistant</h1>
    <p className="text-slate-500 max-w-sm mx-auto">Advanced AI-powered features for your workspace are in development.</p>
  </div>
);

export default AIPlaceholder;
