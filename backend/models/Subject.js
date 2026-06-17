const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  examDate: { type: Date },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  completionPercent: { type: Number, default: 0 }, // 0-100
  totalTopics: { type: Number, default: 10 },
  completedTopics: { type: Number, default: 0 },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', subjectSchema);
