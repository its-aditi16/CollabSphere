const jwt = require('jsonwebtoken');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User'); // Assuming User model exists and has name

const initializeSocket = (io) => {
  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user info to socket
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // Join Project Room
    socket.on('join_project', async (projectId) => {
      try {
        const Project = require('../models/Project');
        const project = await Project.findById(projectId);
        
        if (!project) {
          return socket.emit('error', { message: 'Project not found' });
        }

        // Check if user is a member or owner
        const isMember = project.members.some(m => m.toString() === socket.user.id);
        const isOwner = project.owner.toString() === socket.user.id;

        if (!isMember && !isOwner) {
          return socket.emit('error', { message: 'Not authorized to join this project chat' });
        }

        socket.join(`project_${projectId}`);
        console.log(`User ${socket.user.id} joined project_${projectId}`);
        // Optionally emit previous messages here or let client fetch them via REST API
      } catch (err) {
        console.error('Error joining project:', err);
        socket.emit('error', { message: 'Error joining project' });
      }
    });
    // Leave Project Room
    socket.on('leave_project', (projectId) => {
      socket.leave(`project_${projectId}`);
      console.log(`User ${socket.user.id} left project_${projectId}`);
    });

    // Send Message
    socket.on('send_message', async (data) => {
      try {
        const { projectId, message, type = 'text', senderName } = data;
        
        // Validate inputs
        if (!projectId || !message) return;

        // Save to DB
        const newMsg = new ChatMessage({
          projectId,
          senderId: socket.user.id,
          senderName: senderName || 'Unknown', // Ideally fetch from DB if not passed, but trusting client for speed initially or passed from store
          message,
          type
        });

        await newMsg.save();

        // Broadcast to room (including sender, or exclude sender with broadcast)
        // Usually good to send back to confirm receipt.
        io.to(`project_${projectId}`).emit('receive_message', newMsg);
        
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
};

module.exports = initializeSocket;
