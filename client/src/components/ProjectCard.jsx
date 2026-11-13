import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ExternalLink, Trophy, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col group shadow-lg"
    >
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-indigo-600/10 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
            {project.mode === 'hackathon' ? <Trophy size={20} /> : <Folder size={20} />}
          </div>
          <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-md ${
            project.mode === 'hackathon' ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'
          }`}>
            {project.mode}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6">
          {project.description}
        </p>

        <div className="flex items-center gap-4 py-4 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users size={14} />
            <span>{project.members?.length || 1} members</span>
          </div>
        </div>
      </div>

      <Link 
        to={`/workspace/${project._id}`}
        className="flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-indigo-600 text-white text-sm font-bold transition-all group-hover:bg-slate-800 group-hover:hover:bg-indigo-600"
      >
        <span>Open Workspace</span>
        <ExternalLink size={14} />
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
