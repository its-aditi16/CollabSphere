const express = require('express');
const router = express.Router();
const { createProject, getProjects, sendInvitation, getProjectMembers } = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getProjects);
router.post('/:projectId/invite', authMiddleware, sendInvitation);
router.get('/:projectId/members', authMiddleware, getProjectMembers);

module.exports = router;
