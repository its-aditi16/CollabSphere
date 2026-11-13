import { create } from 'zustand';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import api from '../services/api'; // Assuming axios instance exists

const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  isConnected: false,
  activeProjectId: null,

  connect: (token) => {
    const socket = connectSocket(token);
    
    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('receive_message', (message) => {
      // Only append if it belongs to current project (though room logic should filter, double check is good)
      // And avoid duplicates if we optimistically added
      const { activeProjectId, messages } = get();
      if (message.projectId === activeProjectId) {
         set({ messages: [...messages, message] });
      }
    });
  },

  disconnect: () => {
    disconnectSocket();
    set({ isConnected: false, messages: [], activeProjectId: null });
  },

  joinProject: async (projectId) => {
    const socket = getSocket();
    const { activeProjectId } = get();

    if (activeProjectId === projectId) return; // Already joined

    if (activeProjectId && socket) {
      socket.emit('leave_project', activeProjectId);
    }

    set({ activeProjectId: projectId, isLoading: true });

    // Load history
    try {
      const res = await api.get(`/chat/${projectId}`);
      set({ messages: res.data, isLoading: false });
    } catch (err) {
      console.error('Failed to load chat history', err);
      set({ messages: [], isLoading: false }); // Or handle error state
    }

    if (socket) {
      socket.emit('join_project', projectId);
    }
  },

  sendMessage: async (content, senderName, type = 'text') => {
    const socket = getSocket();
    const { activeProjectId } = get();

    if (!socket || !activeProjectId) return;

    const messageData = {
      projectId: activeProjectId,
      message: content,
      type,
      senderName // Optional, server can handle
    };

    // Optimistic update (optional, but requested "Receive" handles broadcast)
    // We'll rely on server broadcast to ensure simple sync for now, 
    // or we can append with a "pending" state.
    // The requirement "receive_message Broadcast" implies we wait for it.
    
    socket.emit('send_message', messageData);
  }
}));

export default useChatStore;
