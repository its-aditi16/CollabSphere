import React from 'react';
import { Trophy } from 'lucide-react';

const HackathonPlaceholder = () => (
  <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl text-center">
    <div className="p-6 bg-slate-900 rounded-full mb-6 border border-slate-800 shadow-xl">
      <Trophy size={48} className="text-rose-500" />
    </div>
    <h1 className="text-3xl font-bold text-white mb-2">Hackathon Mode</h1>
    <p className="text-slate-500 max-w-sm mx-auto">Accelerate your project with our dedicated hackathon features.</p>
  </div>
);

export default HackathonPlaceholder;
