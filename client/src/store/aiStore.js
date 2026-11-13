import { create } from 'zustand';
import aiService from '../services/aiService';

const useAIStore = create((set, get) => ({
  messages: [], // Array of { role: 'user' | 'bot' | 'system', content: string, timestamp: Date }
  isLoading: false,
  error: null,

  // Add a message to the history
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: new Date() }]
    }));
  },

  // Clear messages (e.g., when switching projects)
  clearMessages: () => set({ messages: [] }),

  // Send a query to the AI API
  askAI: async (projectId, query) => {
    if (!query.trim()) return;

    // 1. Add user message to UI
    get().addMessage({ role: 'user', content: query });
    
    set({ isLoading: true, error: null });

    try {
      // 2. Call API
      const result = await aiService.queryBot(projectId, query);

      // 3. Add AI response to UI
      get().addMessage({ role: 'bot', content: result.response });
    } catch (err) {
      const errorMessage = err.message || 'Failed to get a response from AI';
      set({ error: errorMessage });
      get().addMessage({ role: 'system', content: `Error: ${errorMessage}` });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAIStore;
