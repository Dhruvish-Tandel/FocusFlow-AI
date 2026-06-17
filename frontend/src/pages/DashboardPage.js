import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateSchedule, getStats } from '../utils/api';
import PomodoroTimer from '../components/Timer/PomodoroTimer';
import SubjectList from '../components/Dashboard/SubjectList';
import ScheduleCard from '../components/Schedule/ScheduleCard';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateSchedule = async () => {
    setLoading(true);
    try {
      const { data } = await generateSchedule();
      setSchedule(data);
      setActiveTab('schedule');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate schedule. Add subjects first!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-400">🎯 FocusFlow AI</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Hey, {user?.name} 👋</span>
          <button onClick={logout} className="text-gray-500 hover:text-white text-sm transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Sessions This Week', value: stats.totalSessions },
              { label: 'Completed', value: stats.completedSessions },
              { label: 'Hours Studied', value: `${Math.round(stats.totalStudyMinutes / 60)}h` },
              { label: 'Completion Rate', value: `${stats.completionRate}%` },
            ].map(s => (
              <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                <p className="text-2xl font-bold text-purple-400">{s.value}</p>
                <p className="text-gray-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Generate Button */}
        <button onClick={handleGenerateSchedule} disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl mb-8 text-lg transition-all">
          {loading ? '🤖 Generating your AI study plan...' : '✨ Generate Today\'s Study Plan'}
        </button>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-900 p-1 rounded-xl w-fit">
          {['schedule', 'subjects', 'timer'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all
                ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {tab === 'schedule' ? '📅 Schedule' : tab === 'subjects' ? '📚 Subjects' : '⏱ Timer'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'schedule' && (
          <ScheduleCard schedule={schedule} onRefreshStats={fetchStats} />
        )}
        {activeTab === 'subjects' && <SubjectList />}
        {activeTab === 'timer' && <PomodoroTimer />}
      </div>
    </div>
  );
}
