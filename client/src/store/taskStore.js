import { create } from 'zustand';
import api from '../services/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  draftTasks: [],
  isLoading: false,
  error: null,

  // Fetch tasks for a project
  fetchTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/tasks/${projectId}`);
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch tasks', isLoading: false });
    }
  },

  // Create a new task (manual or from draft)
  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/tasks', taskData);
      set((state) => ({ 
        tasks: [response.data, ...state.tasks],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create task', isLoading: false });
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId, updates) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, updates);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? response.data : t))
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update task' });
    }
  },

  // Generate draft tasks using AI
  generatePlan: async (projectId, messages) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/ai/tasks/plan', { projectId, messages });
      
      // AI returns { tasks: [...] }
      const drafts = response.data.tasks || [];
      set({ draftTasks: drafts, isLoading: false });
      return drafts;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to generate plan', isLoading: false });
      throw error;
    }
  },

  // Clear drafts
  clearDrafts: () => set({ draftTasks: [] }),
  
  // Remove single draft
  removeDraft: (index) => set((state) => ({
    draftTasks: state.draftTasks.filter((_, i) => i !== index)
  }))
}));

export default useTaskStore;
