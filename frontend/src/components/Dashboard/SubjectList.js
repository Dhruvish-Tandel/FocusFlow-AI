import { useState, useEffect } from 'react';
import { getSubjects, addSubject, deleteSubject } from '../../utils/api';

const difficultyColors = { easy: 'text-green-400', medium: 'text-yellow-400', hard: 'text-red-400' };

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', examDate: '', difficulty: 'medium', totalTopics: 10 });

  useEffect(() => { fetchSubjects(); }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await getSubjects();
      setSubjects(data);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addSubject(form);
      setForm({ name: '', examDate: '', difficulty: 'medium', totalTopics: 10 });
      setShowForm(false);
      fetchSubjects();
    } catch (err) { alert('Failed to add subject'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subject?')) return;
    await deleteSubject(id);
    fetchSubjects();
  };

  const getDaysLeft = (examDate) => {
    if (!examDate) return null;
    const days = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-semibold text-lg">Your Subjects ({subjects.length})</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">
          {showForm ? '✕ Cancel' : '+ Add Subject'}
        </button>
      </div>

      {/* Add Subject Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-900 border border-gray-700 rounded-xl p-5 mb-4 space-y-3">
          <input type="text" placeholder="Subject name (e.g. Data Structures)" required
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Exam Date (optional)</label>
              <input type="date"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                value={form.examDate} onChange={e => setForm({ ...form, examDate: e.target.value })} />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Difficulty</label>
              <select className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:border-purple-500 text-sm"
                value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm transition">
            Add Subject
          </button>
        </form>
      )}

      {/* Subject Cards */}
      {subjects.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-gray-400">No subjects added yet. Add your subjects to generate a study plan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subjects.map(subject => {
            const daysLeft = getDaysLeft(subject.examDate);
            return (
              <div key={subject._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">{subject.name}</h3>
                  <div className="flex gap-3 mt-1">
                    <span className={`text-xs ${difficultyColors[subject.difficulty]}`}>{subject.difficulty}</span>
                    {daysLeft !== null && (
                      <span className={`text-xs ${daysLeft <= 3 ? 'text-red-400' : daysLeft <= 7 ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {daysLeft > 0 ? `${daysLeft} days to exam` : 'Exam today!'}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{subject.completionPercent}% done</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(subject._id)} className="text-gray-600 hover:text-red-400 text-lg transition">✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
