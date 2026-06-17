# FocusFlow AI 
> An AI-powered study planner that helps university students automatically schedule, prioritize, and track study sessions.

---

## Problem Statement

University students struggle to plan *when* and *what* to study across multiple subjects and deadlines - leading to last-minute cramming, burnout, and poor academic performance.

Research shows students waste 45-50 minutes daily just deciding what to study next. FocusFlow AI eliminates that decision overhead by generating a personalized, adaptive daily study plan using an LLM - recovering ~20% of lost study efficiency per user.

---

## Current Progress

- [x] Project structure initialized
- [x] Backend API (Node.js + Express)
- [x] MongoDB models for User, Subject, Session
- [x] Auth routes (register/login with JWT)
- [x] Frontend scaffold (React + Tailwind CSS)
- [x] Dashboard UI component(will make better with time)
- [x] Pomodoro Timer component
- [ ] AI schedule generation route (in progress will be using chatgpt(free model))[but claude will be better(paid one)]
- [ ] Subject-wise progress tracker (in progress)
- [ ] Weekly productivity dashboard (planned)
- [ ] AI Recovery Mode (planned)

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI / LLM | Chatgpt |
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (Atlas) |
| Hosting | Vercel (frontend) + Render (backend) |
| Auth | JWT (JSON Web Tokens) |

---

## Planned Features

### Must Have (MVP)
- AI-generated daily study schedule
- Smart Priority Engine (deadline urgency + subject difficulty)
- Pomodoro-style focus timer

### Should Have
- Study habit tracking with reminders
- Weekly productivity dashboard
- Subject-wise progress tracker

### Nice to Have
- AI Recovery Mode (detects 3 missed sessions → auto-replans)
- Smart break suggestions based on session intensity
- Google Calendar sync

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Anthropic API key

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/focusflow-ai.git
cd focusflow-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Fill in REACT_APP_API_URL=http://localhost:5000
npm start
```


---

## Repository Structure

```
focusflow-ai/
├── README.md
├── docs/
│   └── api.md  (in progress)                # API endpoint documentation
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Dashboard/
│       │   ├── Schedule/
│       │   ├── Timer/
│       │   └── Auth/
│       ├── pages/
│       ├── hooks/
│       ├── context/
│       └── utils/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── config/
├── assets/
└── models/                     
```

---

## SDG Alignment

**SDG 4 — Quality Education**: FocusFlow AI promotes equitable academic success by giving every student - regardless of discipline or background - access to intelligent study planning that improves learning outcomes.

---

## Team

| Name | Role |
|---|---|
| Dhruvish Tandel | Full Stack Developer |

