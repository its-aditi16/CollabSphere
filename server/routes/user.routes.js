const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Search users by name or email
router.get('/search', authMiddleware, userController.searchUsers);

// Get invitations for the current user
router.get('/invitations', authMiddleware, userController.getInvitations);

// Respond to an invitation
router.post('/invitations/:invitationId/respond', authMiddleware, userController.respondToInvitation);

// Get current user profile (useful for checking auth state)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
