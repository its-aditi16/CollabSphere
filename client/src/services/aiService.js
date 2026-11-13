import api from './api';

const aiService = {
  queryBot: async (projectId, query) => {
    try {
      const response = await api.post('/ai/query', { projectId, query });
      return response.data;
    } catch (error) {
      console.error('AI Query Error:', error);
      throw error.response?.data || { message: 'Failed to connect to AI server' };
    }
  }
};

export default aiService;
