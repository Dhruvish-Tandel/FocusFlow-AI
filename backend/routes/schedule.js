const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');
const router = express.Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/schedule/generate — AI generates today's study plan
router.post('/generate', protect, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id });

    if (!subjects.length) {
      return res.status(400).json({ message: 'Please add at least one subject first.' });
    }

    const today = new Date().toDateString();
    const studyHours = req.user.studyHoursPerDay || 4;
    const startTime = req.user.preferredStartTime || '09:00';

    // Build subject summary for the prompt
    const subjectSummary = subjects.map(s => {
      const daysLeft = s.examDate
        ? Math.ceil((new Date(s.examDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null;
      return `- ${s.name}: difficulty=${s.difficulty}, completion=${s.completionPercent}%${daysLeft ? `, exam in ${daysLeft} days` : ', no exam date set'}`;
    }).join('\n');

    const prompt = `
You are FocusFlow AI, an intelligent study planner for university students.

Today is ${today}. The student has ${studyHours} hours available starting at ${startTime}.

Their subjects:
${subjectSummary}

Generate a prioritized study schedule for today. Return ONLY valid JSON in this exact format:
{
  "greeting": "A short motivating message (1 sentence)",
  "sessions": [
    {
      "subject": "Subject Name",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "duration": 50,
      "priority": "high|medium|low",
      "focus": "Specific topic or chapter to cover",
      "reason": "Why this subject is prioritized today (1 sentence)"
    }
  ],
  "tip": "One study tip for today"
}

Rules:
- Each session should be 25-60 minutes with 10-min breaks between
- Prioritize subjects with nearest exam dates and lowest completion
- Hard subjects go in the first half of the day (peak focus time)
- Total sessions should fit within the ${studyHours} hour window
- Be specific about what to study in each session
`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text;
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const schedule = JSON.parse(cleaned);

    res.json({ date: today, schedule });
  } catch (err) {
    console.error('Schedule generation error:', err);
    res.status(500).json({ message: 'Failed to generate schedule. Please try again.' });
  }
});

// POST /api/schedule/recover — AI Recovery Mode (3 missed sessions → replan)
router.post('/recover', protect, async (req, res) => {
  try {
    const { missedSessions } = req.body; // array of { subject, date }
    const subjects = await Subject.find({ user: req.user._id });

    const prompt = `
You are FocusFlow AI. A student has missed ${missedSessions.length} study sessions:
${missedSessions.map(s => `- ${s.subject} (missed on ${s.date})`).join('\n')}

Their remaining subjects: ${subjects.map(s => s.name).join(', ')}

Create a short recovery plan for the next 3 days to catch up. Return ONLY valid JSON:
{
  "message": "Encouraging recovery message",
  "recoveryPlan": [
    {
      "day": "Day 1 - Monday",
      "sessions": [{ "subject": "", "duration": 50, "focus": "" }]
    }
  ],
  "advice": "One key advice to prevent future missed sessions"
}
`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text;
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const recovery = JSON.parse(cleaned);

    res.json(recovery);
  } catch (err) {
    res.status(500).json({ message: 'Recovery plan generation failed.' });
  }
});

module.exports = router;
