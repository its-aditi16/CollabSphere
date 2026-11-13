import React, { useEffect } from 'react';
import useDashboardStore from '../store/dashboardStore';
import ProjectCard from '../components/ProjectCard';
import { FolderOpen } from 'lucide-react';

const Projects = () => {
  const { projects, loading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600/10 text-indigo-500 rounded-2xl">
          <FolderOpen size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Your Projects</h1>
          <p className="text-slate-400">View and manage all your collaborative spaces</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>
          ))
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
