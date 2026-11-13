const mongoose = require('mongoose');
console.log('Project.js: Mongoose version:', mongoose.version);

try {
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  techStack: { type: String, default: '' },
  taskList: [{ 
    title: String, 
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' } 
  }],
  createdAt: { type: Date, default: Date.now }
});
console.log('Project.js: Schema created');

module.exports = mongoose.model('Project', projectSchema);

} catch (error) {
  console.error('Project.js: Error creating schema:', error);
  throw error;
}
