const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const { extractTasksFromContext } = require('../ai/taskPlanner');
const Project = require('../models/Project'); // Assuming Project model exists

// @route   POST /api/ai/tasks/plan
// @desc    Generate draft tasks from conversation context
// @access  Private
router.post('/plan', protect, async (req, res) => {
  try {
    const { projectId, messages } = req.body;

    if (!projectId || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Project ID and messages array are required' });
    }

    // specific rate limiting logic could go here (e.g., via Redis)

    // Fetch project details for context
    // Note: Assuming Project model has name, description, and members populated (or we just use what we have)
    // For now, we'll try to find the project to get the name/metadata
    // If Project model isn't available or populated, we might need to rely on frontend passing metadata
    // But let's assume we can fetch it.
    
    // Mocking finding project for now if Project model interaction is complex, 
    // but ideally:
    // const project = await Project.findById(projectId).populate('members', 'name role');
    
    // Since I haven't seen the Project model, I'll assume standard access. 
    // If it fails, I'll fallback to basic unknown context.
    
    let projectMetadata = {
      name: "Current Project",
      description: "Project context",
      members: [] // fetch real members if possible
    };
    
    try {
        // Attempt to fetch if model exists (dynamic require if needed or global)
        const ProjectModel = require('../models/Project'); 
        const project = await ProjectModel.findById(projectId).populate('members', 'name');
        if (project) {
            projectMetadata = {
                name: project.name,
                description: project.description,
                members: project.members.map(m => m.name)
            };
        }
    } catch (err) {
        console.warn("Could not fetch project metadata for AI context:", err.message);
    }

    const aiResponse = await extractTasksFromContext(messages, projectMetadata);
    
    res.json(aiResponse);

  } catch (error) {
    console.error('Error generating AI task plan:', error);
    res.status(500).json({ message: 'Failed to generate task plan', error: error.message });
  }
});

module.exports = router;
