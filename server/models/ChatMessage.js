const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true // Indexed for fast queries by project
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: { // Denormalize for easier display without population every time
    type: String, 
    required: true 
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000 // Reasonable limit
  },
  type: {
    type: String,
    enum: ['text', 'system'],
    default: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
