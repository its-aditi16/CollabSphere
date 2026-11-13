const Project = require('../models/Project');
const ChatMessage = require('../models/ChatMessage');
const redis = require('redis');

// Initialize Redis client
const client = redis.createClient({
  socket: {
    connectTimeout: 2000 // 2 seconds timeout
  }
});
client.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    // Suppress repeated logs if needed, or just log once
  }
});

(async () => {
  try {
    // Attempt connection, but don't block the module exports if it fails
    await client.connect();
  } catch (err) {
    // Silent fail if Redis is not available
  }
})();

/**
 * Assembles project context from metadata and chat history.
 * @param {string} projectId 
 * @returns {Promise<Object>}
 */
const assembleContext = async (projectId) => {
  try {
    // 1. Check Redis Cache
    if (client.isOpen) {
      const cachedContext = await client.get(`context:${projectId}`);
      if (cachedContext) {
        return JSON.parse(cachedContext);
      }
    }

    // 2. Fetch Project Metadata
    let project;
    try {
      project = await Project.findById(projectId);
    } catch (err) {
      console.warn(`Invalid Project ID format: ${projectId}. Using fallback for demo.`);
    }

    if (!project) {
      // For demo purposes, fallback to the latest project if the requested one is not found or invalid
      project = await Project.findOne().sort({ createdAt: -1 });
      if (!project) throw new Error('No projects found in database');
    }

    // 3. Fetch Recent Important Chat Messages
    const messages = await ChatMessage.find({ 
      projectId: project._id, 
      type: 'text' 
    })
    .sort({ createdAt: -1 })
    .limit(50); 

    // Filter out casual chat (simple heuristic: length > 10 and not just emojis/greetings)
    const importantMessages = messages
      .filter(m => {
        const text = m.message.trim().toLowerCase();
        const isCasual = text.length < 10 || 
                         ['hi', 'hello', 'hey', 'ok', 'thanks', '👍', 'thx'].includes(text);
        return !isCasual;
      })
      .reverse(); // Back to chronological order

    // 4. Condense Context
    const condensedContext = {
      projectName: project.name,
      description: project.description,
      techStack: project.techStack || 'Not specified',
      tasks: project.taskList.map(t => `${t.title} (${t.status})`).join(', ') || 'None',
      recentDiscussions: importantMessages.map(m => `${m.senderName}: ${m.message}`).join('\n')
    };

    const finalContext = {
      projectId,
      condensedContext,
      lastUpdated: new Date()
    };

    // 5. Cache in Redis (Expire in 5 minutes)
    if (client.isOpen) {
      await client.setEx(`context:${projectId}`, 300, JSON.stringify(finalContext));
    }

    return finalContext;
  } catch (error) {
    console.error('Context Assembly Error:', error);
    throw error;
  }
};

module.exports = { assembleContext };
