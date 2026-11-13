import React, { useEffect, useState } from 'react';
import { Plus, Folder, Layout, LayoutGrid, MessageSquare, CheckCircle2, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useDashboardStore from '../store/dashboardStore';
import StatsCard from '../components/StatsCard';
import ProjectCard from '../components/ProjectCard';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { projects, stats, loading, fetchDashboardData } = useDashboardStore();
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', mode: 'normal' });

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      fetchDashboardData();
      setShowModal(false);
      setNewProject({ name: '', description: '', mode: 'normal' });
    } catch (err) {
      console.error(err);
    }
  };

  // DESTINATION: Landing Page for Guest Users
  const { token } = useAuthStore();
  
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-block p-4 bg-indigo-600/10 rounded-full mb-4">
            <Trophy size={48} className="text-indigo-500" />
          </div>
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-white tracking-tight">
            CollabSphere
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            The AI-First Collaboration Platform designed to supercharge your team's productivity.
            Manage projects, chat in real-time, and build alongside your AI assistant.
          </p>
          <div className="flex justify-center gap-4 pt-4">
             {/* Buttons handled by Navbar, but can duplicate here for CTA */}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {[
            { icon: <MessageSquare size={32} />, title: "Real-time Chat", desc: "Instantly collaborate with your team in dedicated channels." },
            { icon: <LayoutGrid size={32} />, title: "Smart Workspaces", desc: "Organize projects, tasks, and files in one unified interface." },
            { icon: <CheckCircle2 size={32} />, title: "AI-Powered", desc: "Built-in AI assistant to generate content and automate workflows." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-indigo-500/30 transition-all text-left"
            >
              <div className="p-3 bg-slate-800 w-fit rounded-xl mb-4 text-indigo-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // DESTINATION: Authenticated Dashboard
  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-4 transition-all"
          >
            Welcome back, {user?.name} <span className="animate-bounce-slow text-3xl">👋</span>
          </motion.h1>
          <p className="mt-2 text-slate-400 font-medium">Build faster with AI-powered collaboration</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
        >
          <Plus size={20} />
          Create New Project
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Projects" 
          value={stats.activeProjects} 
          icon={<LayoutGrid size={24} />} 
          trend="+20%"
          subValue="vs last month"
        />
        <StatsCard 
          title="Tasks Pending" 
          value={stats.tasksPending} 
          icon={<CheckCircle2 size={24} />} 
          trend="-5%"
          subValue="from yesterday"
        />
        <StatsCard 
          title="Messages Today" 
          value={stats.messagesToday} 
          icon={<MessageSquare size={24} />} 
          trend="+12"
          subValue="new thread alerts"
        />
        <StatsCard 
          title="Hackathon Mode" 
          value={stats.hackathonMode ? "ON" : "OFF"} 
          icon={<Trophy size={24} />} 
          subValue={stats.hackathonMode ? "Competing active" : "Ready to join"}
        />
      </div>

      {/* Projects Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Folder size={24} className="text-indigo-500" />
            Your Projects
          </h2>
          <div className="text-sm text-slate-500 font-medium">
            Showing {projects.length} working projects
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl text-center"
          >
            <div className="p-6 bg-slate-900 rounded-full mb-6 border border-slate-800 shadow-xl">
              <Folder size={48} className="text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No projects yet. 🚀</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start by creating your first project to unlock powerful collaboration tools.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </section>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create Project</h2>
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. AI Content Platform"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                    placeholder="Tell us about this project..."
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['normal', 'hackathon'].map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setNewProject({ ...newProject, mode })}
                        className={`py-3 rounded-xl border font-bold capitalize transition-all ${
                          newProject.mode === mode 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    Launch Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
