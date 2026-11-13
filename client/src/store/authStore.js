import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: true,

  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  },

  register: async (name, email, password, skills, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, skills, role });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, loading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, token, loading: false });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },
}));

export default useAuthStore;
