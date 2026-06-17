const express = require('express');
const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET all subjects for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ examDate: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add a subject
router.post('/', protect, async (req, res) => {
  try {
    const subject = await Subject.create({ ...req.body, user: req.user._id });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update subject progress
router.put('/:id', protect, async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a subject
router.delete('/:id', protect, async (req, res) => {
  try {
    await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Subject removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
