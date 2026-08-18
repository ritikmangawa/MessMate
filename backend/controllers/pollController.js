const Poll = require('../models/poll.model');

// @desc    Get active poll for student's mess
// @route   GET /api/polls
const getActivePoll = async (req, res) => {
  try {
    let poll = await Poll.findOne({ messId: req.user.messId, isActive: true });
    
    // Auto-seed a poll if none exists for testing
    if (!poll) {
      poll = await Poll.create({
        messId: req.user.messId,
        question: "What should be this Sunday's special lunch?",
        options: [
          { text: "Chicken Biryani" },
          { text: "Paneer Butter Masala" },
          { text: "Chole Bhature" }
        ],
        votedStudents: [],
        isActive: true
      });
    }

    // Determine if the current user has already voted
    const hasVoted = poll.votedStudents.includes(req.user._id);

    res.status(200).json({ poll, hasVoted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Vote on a poll
// @route   POST /api/polls/vote
const votePoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    
    const poll = await Poll.findOne({ _id: pollId, messId: req.user.messId, isActive: true });
    if (!poll) return res.status(404).json({ message: 'Poll not found or inactive.' });

    if (poll.votedStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already voted on this poll.' });
    }

    const option = poll.options.id(optionId);
    if (!option) return res.status(404).json({ message: 'Option not found.' });

    option.votes += 1;
    poll.votedStudents.push(req.user._id);
    await poll.save();

    res.status(200).json({ message: 'Vote recorded successfully!', poll });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new poll (Admin only)
// @route   POST /api/polls/create
const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    // Deactivate existing polls for this mess
    await Poll.updateMany({ messId: req.user.messId }, { isActive: false });

    // Format options from array of strings to array of objects
    const formattedOptions = options.map(opt => ({ text: opt, votes: 0 }));

    const newPoll = await Poll.create({
      messId: req.user.messId,
      question,
      options: formattedOptions,
      votedStudents: [],
      isActive: true
    });

    res.status(201).json({ message: 'Poll created successfully!', poll: newPoll });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getActivePoll, votePoll, createPoll };
