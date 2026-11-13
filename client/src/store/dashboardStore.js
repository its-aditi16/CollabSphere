import { create } from 'zustand';
import api from '../services/api';

const useDashboardStore = create((set, get) => ({
  projects: [],
  loading: false,
  isBotOpen: false,
  stats: {
    activeProjects: 0,
    tasksPending: 0,
    messagesToday: 0,
    hackathonMode: false,
  },

  setBotOpen: (status) => set({ isBotOpen: status }),
  toggleBot: () => set((state) => ({ isBotOpen: !state.isBotOpen })),

  fetchDashboardData: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/projects');
      let projects = res.data;
      
      // If no projects from API, let the UI handle the empty state
      if (!projects) {
        projects = [];
      }

      const stats = {
        activeProjects: projects.length,
        tasksPending: 12,
        messagesToday: 48,
        hackathonMode: projects.some(p => p.mode === 'hackathon'),
      };

      set({ projects, stats, loading: false });
    } catch (err) {
      console.error('Backend connection error:', err);
      // Don't use mock data that causes crashes. Just show empty state or error.
      set({ 
        projects: [], 
        stats: { activeProjects: 0, tasksPending: 0, messagesToday: 0, hackathonMode: false }, 
        loading: false 
      });
    }
  },
}));

export default useDashboardStore;
