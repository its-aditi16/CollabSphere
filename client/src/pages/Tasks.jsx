import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const TasksPlaceholder = () => (
  <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl text-center">
    <div className="p-6 bg-slate-900 rounded-full mb-6 border border-slate-800 shadow-xl">
      <CheckCircle2 size={48} className="text-indigo-500" />
    </div>
    <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
    <p className="text-slate-500 max-w-sm mx-auto">Manage your team's workflow with ease. Coming soon.</p>
  </div>
);

export default TasksPlaceholder;
