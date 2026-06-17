import { useState } from 'react';
import { logSession } from '../../utils/api';

const priorityColors = { high: 'text-red-400', medium: 'text-yellow-400', low: 'text-green-400' };
const priorityBg = { high: 'border-red-500/30', medium: 'border-yellow-500/30', low: 'border-green-500/30' };

export default function ScheduleCard({ schedule, onRefreshStats }) {
  const [sessionStatus, setSessionStatus] = useState({});

  const markSession = async (index, status, subjectName, duration) => {
    setSessionStatus(prev => ({ ...prev, [index]: status }));
    try {
      await logSession({ subject: subjectName, duration, status });
      onRefreshStats();
    } catch (err) {
      console.error('Failed to log session:', err);
    }
  };

  if (!schedule) {
    return (
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
        <p className="text-5xl mb-4">🤖</p>
        <p className="text-gray-400 text-lg">Click "Generate Today's Study Plan" to get started</p>
        <p className="text-gray-600 text-sm mt-2">Make sure you've added your subjects first</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
        <p className="text-purple-300 font-medium">{schedule.schedule.greeting}</p>
      </div>

      {/* Sessions */}
      {schedule.schedule.sessions.map((session, i) => (
        <div key={i} className={`bg-gray-900 rounded-xl border p-5 ${priorityBg[session.priority]}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-white font-semibold text-lg">{session.subject}</h3>
              <p className="text-gray-400 text-sm">{session.startTime} – {session.endTime} · {session.duration} min</p>
            </div>
            <span className={`text-xs font-semibold uppercase ${priorityColors[session.priority]}`}>
              {session.priority} priority
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-1">📖 {session.focus}</p>
          <p className="text-gray-500 text-xs mb-4">💡 {session.reason}</p>

          {/* Action Buttons */}
          {!sessionStatus[i] ? (
            <div className="flex gap-2">
              <button onClick={() => markSession(i, 'completed', session.subject, session.duration)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition">
                ✅ Done
              </button>
              <button onClick={() => markSession(i, 'skipped', session.subject, session.duration)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 rounded-lg transition">
                ⏭ Skip
              </button>
            </div>
          ) : (
            <div className={`text-center py-2 rounded-lg text-sm font-medium
              ${sessionStatus[i] === 'completed' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
              {sessionStatus[i] === 'completed' ? '✅ Completed!' : '⏭ Skipped'}
            </div>
          )}
        </div>
      ))}

      {/* Daily Tip */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <p className="text-gray-400 text-sm">💡 <span className="text-gray-300">{schedule.schedule.tip}</span></p>
      </div>
    </div>
  );
}
