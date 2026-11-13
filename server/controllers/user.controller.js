const User = require('../models/User');
const Invitation = require('../models/Invitation');
const Project = require('../models/Project');

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    // Case-insensitive search by name or email
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('name email _id'); // Don't return sensitive data

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({ 
      recipient: req.user.id,
      status: 'pending' 
    }).populate('sender', 'name email')
      .populate('project', 'name');

    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { status } = req.body; // 'accepted' or 'declined'

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' });

    if (invitation.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    invitation.status = status;
    await invitation.save();

    if (status === 'accepted') {
      const project = await Project.findById(invitation.project);
      if (project) {
        if (!project.members.includes(req.user.id)) {
           project.members.push(req.user.id);
           await project.save();
        }
      }
    }

    res.json({ message: `Invitation ${status}`, invitation });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
