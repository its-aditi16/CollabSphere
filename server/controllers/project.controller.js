const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, description, mode } = req.body;
    const project = new Project({
      name,
      description,
      mode,
      owner: req.user.id,
      members: [req.user.id]
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }]
    }).populate('owner', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendInvitation = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;
    const User = require('../models/User');
    const Invitation = require('../models/Invitation');

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Only owner can invite' });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingInvite = await Invitation.findOne({
      project: projectId,
      email: email,
      createdAt: { $gte: startOfDay }
    });

    if (existingInvite) {
        return res.status(400).json({ message: 'Invitation already sent today' });
    }

    const recipient = await User.findOne({ email });

    if (recipient && project.members.includes(recipient._id)) {
        return res.status(400).json({ message: 'User already a member' });
    }
    
    // Check if invite exists specifically for this user if we found them
    if (recipient) {
         const pendingInvite = await Invitation.findOne({
            project: projectId,
            recipient: recipient._id,
            status: 'pending'
         });
         if (pendingInvite) return res.status(400).json({ message: 'Invitation already pending for this user' });
    }

    const invitation = new Invitation({
      sender: req.user.id,
      recipient: recipient ? recipient._id : null,
      email,
      project: projectId
    });

    await invitation.save();
    res.json({ message: 'Invitation sent', invitation });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate('members', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Check if requester is a member
    if (!project.members.some(member => member._id.toString() === req.user.id) && project.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(project.members);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
