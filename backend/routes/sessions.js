const express = require('express');
const Session = require('../models/Session');
const { protect } = require('../middleware/auth');
const router = express.Router();

// POST log a completed/skipped session
router.post('/', protect, async (req, res) => {
  try {
    const session = await Session.create({ ...req.body, user: req.user._id });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET session history for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .populate('subject', 'name')
      .sort({ date: -1 })
      .limit(50);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET weekly stats
router.get('/stats', protect, async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const sessions = await Session.find({
      user: req.user._id,
      date: { $gte: weekAgo }
    }).populate('subject', 'name');

    const completed = sessions.filter(s => s.status === 'completed');
    const totalMinutes = completed.reduce((sum, s) => sum + s.duration, 0);
    const skipped = sessions.filter(s => s.status === 'skipped').length;

    res.json({
      totalSessions: sessions.length,
      completedSessions: completed.length,
      skippedSessions: skipped,
      totalStudyMinutes: totalMinutes,
      completionRate: sessions.length ? Math.round((completed.length / sessions.length) * 100) : 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
