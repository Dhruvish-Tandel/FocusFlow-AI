import { useState, useEffect, useRef } from 'react';

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'text-purple-400' },
  short: { label: 'Short Break', duration: 5 * 60, color: 'text-green-400' },
  long: { label: 'Long Break', duration: 15 * 60, color: 'text-blue-400' },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(MODES[mode].duration);
    setRunning(false);
    clearInterval(intervalRef.current);
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') setSessions(s => s + 1);
            // Browser notification
            if (Notification.permission === 'granted') {
              new Notification('FocusFlow AI', {
                body: mode === 'focus' ? '🎉 Focus session done! Take a break.' : '⏰ Break over! Back to studying.',
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const progress = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100;

  const requestNotifications = () => {
    if (Notification.permission === 'default') Notification.requestPermission();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
        {/* Mode Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-800 p-1 rounded-xl">
          {Object.entries(MODES).map(([key, val]) => (
            <button key={key} onClick={() => setMode(key)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all
                ${mode === key ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {val.label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative mb-8">
          <svg className="w-48 h-48 mx-auto -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="6" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#7c3aed" strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold font-mono ${MODES[mode].color}`}>{formatTime(timeLeft)}</span>
            <span className="text-gray-500 text-sm mt-1">{MODES[mode].label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center mb-6">
          <button onClick={() => { setRunning(!running); requestNotifications(); }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-xl font-semibold transition">
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button onClick={() => { setRunning(false); setTimeLeft(MODES[mode].duration); }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-xl transition">
            ↺ Reset
          </button>
        </div>

        {/* Session Counter */}
        <div className="flex justify-center gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${i < sessions % 4 ? 'bg-purple-500' : 'bg-gray-700'}`} />
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-2">{sessions} focus sessions completed today</p>
      </div>
    </div>
  );
}
