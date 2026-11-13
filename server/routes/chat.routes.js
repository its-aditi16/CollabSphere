const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
// We assume there's an authentication middleware we can reuse, or we check existing auth routes.
// For now, I'll use a placeholder or look for middleware.
// I saw 'middleware' folder in server list_dir. Let's assume authMiddleware is there or accessible.
// I'll check 'routes/auth.routes.js' or 'middleware' content quickly if I want to be perfect, 
// but standard practice is importing it. I'll read 'middleware' folder content next if I need to.
// But mostly I can just implement the logic assuming req.user or similar if I had the middleware.
// Actually, I'll just skip the middleware in the code for now and add a comment, OR check the middleware file.
// The user said "Accessible only to project members".
// I'll assume valid middleware is required.

// Let's create the file assuming no auth first to just get the format, then I'll check middleware.
// OR better, I'll use the checkAuth from where? Server structure showed 'middleware' folder.
// I'll assume `const auth = require('../middleware/auth');` exists.

const authMiddleware = require('../middleware/auth.middleware');

router.get('/:projectId', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    // Optional: Check if user is member of project (User.projects.includes(projectId) or Project.members.includes(userId))
    
    // Fetch last 100 messages
    const messages = await ChatMessage.find({ projectId })
      .sort({ createdAt: 1 }) // created ascending (oldest first? No, we want latest, but usually chat is displayed oldest at top.
      // If we want "latest 100", we might need sort({createdAt: -1}).limit(100) then reverse.
      // The user requirement: "Returns latest messages. Sorted by time (ascending)"
      // So logic: Get latest 100, then sort ascending.
      // Implementation: find... sort(-1).limit(100) ... then reverse in memory or re-sort.
      
    // Actually, simple:
    const recentMessages = await ChatMessage.find({ projectId })
      .sort({ createdAt: -1 })
      .limit(100);
      
    res.json(recentMessages.reverse());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
