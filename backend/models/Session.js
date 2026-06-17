const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number, required: true }, // minutes
  status: { type: String, enum: ['completed', 'skipped', 'in-progress'], default: 'in-progress' },
  focusScore: { type: Number, min: 1, max: 5 }, // user self-rates
  notes: { type: String }
});

module.exports = mongoose.model('Session', sessionSchema);
