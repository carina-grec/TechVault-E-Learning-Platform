import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

// Styling constants
const TAB_ACTIVE = "flex flex-col items-center justify-center border-b-[4px] border-b-slate-900 text-slate-900 pb-3 pt-4 cursor-pointer";
const TAB_INACTIVE = "flex flex-col items-center justify-center border-b-[4px] border-b-transparent text-slate-500 pb-3 pt-4 hover:text-slate-900 hover:border-b-slate-400 cursor-pointer";

export default function AdminContentCMS() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('VAULTS');
  const [vaults, setVaults] = useState([]);
  const [quests, setQuests] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Load
  useEffect(() => {
    if (token) {
      fetchAllContent();
    }
  }, [token]);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      const [vData, qData, lData, zData] = await Promise.all([
        api.getAdminVaults(token),
        api.getAdminQuests(token),
        api.getAdminLessons(token).catch(() => []), // Fallback if API missing
        api.getAdminQuizzes(token).catch(() => [])
      ]);
      setVaults(vData || []);
      setQuests(qData || []);
      setLessons(lData || []);
      setQuizzes(zData || []);
    } catch (e) {
      console.error("Failed to load content", e);
    } finally {
      setLoading(false);
    }
  };

  // Filter content by type and search term
  const filteredVaults = vaults.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // specificQuests = Code Challenges (from generic quests list)
  const filteredQuests = quests
    .filter(q => q.questType === 'CODE_CHALLENGE')
    .filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // specificLessons = Lessons (from lessons state)
  const filteredLessons = lessons
    .filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // specificQuizzes = Quizzes (from quizzes state)
  const filteredQuizzes = quizzes
    .filter(z => z.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreate = () => {
    if (activeTab === 'VAULTS') navigate('/vault/create');
    else if (activeTab === 'QUESTS') navigate('/quest-editor');
    else if (activeTab === 'LESSONS') navigate('/lesson-editor');
    else if (activeTab === 'QUIZZES') navigate('/quiz-editor');
  };

  // Render Helpers
  const renderVaultsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="border-b-2 border-slate-900">
          <tr>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Vault Title</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVaults.length > 0 ? filteredVaults.map((vault) => (
            <tr key={vault.id} className="bg-white border-b-2 border-slate-900 last:border-b-0 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 text-slate-900 text-sm font-medium">{vault.title}</td>
              <td className="px-4 py-4 text-slate-600 text-sm font-medium truncate max-w-[200px]">{vault.description}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-bold border-2 border-slate-900 ${vault.status === 'PUBLISHED' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>
                  {vault.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <button
                  onClick={() => navigate(`/vault/create?edit=${vault.id}`)}
                  className="text-slate-900 text-sm font-bold hover:text-[#00B8A9] transition-colors"
                >
                  Edit
                </button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="p-4 text-center text-slate-500">No vaults found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderQuestsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="border-b-2 border-slate-900">
          <tr>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Quest Title</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">XP</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuests.length > 0 ? filteredQuests.map((quest) => (
            <tr key={quest.id} className="bg-white border-b-2 border-slate-900 last:border-b-0 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 text-slate-900 text-sm font-medium">{quest.title}</td>
              <td className="px-4 py-4 text-slate-600 text-sm font-medium">{quest.questType}</td>
              <td className="px-4 py-4 text-slate-600 text-sm font-medium">{quest.xpValue} XP</td>
              <td className="px-4 py-4">
                <button
                  onClick={() => navigate(`/quest-editor?id=${quest.id}`)}
                  className="text-slate-900 text-sm font-bold hover:text-[#00B8A9] transition-colors"
                >
                  Edit
                </button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="p-4 text-center text-slate-500">No quests found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderLessonsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="border-b-2 border-slate-900">
          <tr>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Lesson Title</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">XP</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLessons.length > 0 ? filteredLessons.map((lesson) => (
            <tr key={lesson.id} className="bg-white border-b-2 border-slate-900 last:border-b-0 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 text-slate-900 text-sm font-medium">{lesson.title}</td>
              <td className="px-4 py-4 text-slate-600 text-sm font-medium">{lesson.xpValue} XP</td>
              <td className="px-4 py-4">
                <button
                  onClick={() => navigate(`/lesson-editor?id=${lesson.id}`)}
                  className="text-slate-900 text-sm font-bold hover:text-[#00B8A9] transition-colors"
                >
                  Edit
                </button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="3" className="p-4 text-center text-slate-500">No lessons found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderQuizzesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="border-b-2 border-slate-900">
          <tr>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Quiz Title</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Questions</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">XP</th>
            <th className="px-4 py-3 text-left text-slate-900 text-sm font-bold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuizzes.length > 0 ? filteredQuizzes.map((quiz) => (
            <tr key={quiz.id} className="bg-white border-b-2 border-slate-900 last:border-b-0 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 text-slate-900 text-sm font-medium">{quiz.title}</td>
              <td className="px-4 py-4 text-slate-600 text-sm font-medium">{quiz.questions?.length || 0}</td>
              <td className="px-4 py-4 text-slate-600 text-sm font-medium">{quiz.xpValue} XP</td>
              <td className="px-4 py-4">
                <button
                  onClick={() => navigate(`/quiz-editor?id=${quiz.id}`)}
                  className="text-slate-900 text-sm font-bold hover:text-[#00B8A9] transition-colors"
                >
                  Edit
                </button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="p-4 text-center text-slate-500">No quizzes found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <MainLayout fullWidth={true}>
      <div className="min-h-screen p-8 font-display">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-bold leading-tight tracking-tighter">Content Management</h1>
            <button
              onClick={handleCreate}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#FF37A6] text-white text-sm font-bold leading-normal tracking-wide border-2 border-slate-900 shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-transform"
            >
              <span className="truncate">Create New</span>
            </button>
          </header>

          <div className="bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-200 rounded-md shadow-[4px_4px_0px_#000]">
            {/* Tabs */}
            <div className="border-b-2 border-slate-900 dark:border-slate-200">
              <div className="flex px-4 gap-4 overflow-x-auto">
                <div
                  onClick={() => setActiveTab('VAULTS')}
                  className={activeTab === 'VAULTS' ? TAB_ACTIVE : TAB_INACTIVE}
                >
                  <p className={`text-sm font-bold leading-normal ${activeTab === 'VAULTS' ? 'text-slate-900 dark:text-slate-100' : ''}`}>All Vaults ({vaults.length})</p>
                </div>
                <div
                  onClick={() => setActiveTab('QUESTS')}
                  className={activeTab === 'QUESTS' ? TAB_ACTIVE : TAB_INACTIVE}
                >
                  <p className={`text-sm font-bold leading-normal ${activeTab === 'QUESTS' ? 'text-slate-900 dark:text-slate-100' : ''}`}>Quests ({quests.length})</p>
                </div>
                <div
                  onClick={() => setActiveTab('LESSONS')}
                  className={activeTab === 'LESSONS' ? TAB_ACTIVE : TAB_INACTIVE}
                >
                  <p className={`text-sm font-bold leading-normal ${activeTab === 'LESSONS' ? 'text-slate-900 dark:text-slate-100' : ''}`}>Lessons ({lessons.length})</p>
                </div>
                <div
                  onClick={() => setActiveTab('QUIZZES')}
                  className={activeTab === 'QUIZZES' ? TAB_ACTIVE : TAB_INACTIVE}
                >
                  <p className={`text-sm font-bold leading-normal ${activeTab === 'QUIZZES' ? 'text-slate-900 dark:text-slate-100' : ''}`}>Quizzes ({quizzes.length})</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b-2 border-slate-900 dark:border-slate-200">
              <div className="flex items-center border-2 border-slate-900 dark:border-slate-200 rounded-md bg-white dark:bg-slate-900 shadow-[2px_2px_0px_#000]">
                <div className="text-slate-500 flex items-center justify-center pl-3">
                  <span className="material-symbols-outlined text-2xl">search</span>
                </div>
                <input
                  className="w-full flex-1 resize-none overflow-hidden rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-0 border-none bg-transparent h-10 placeholder:text-slate-500 px-2 text-base font-medium"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Content Table */}
            <div className="p-4">
              {loading ? (
                <div className="text-center py-10 text-slate-500">Loading content...</div>
              ) : (
                <>
                  {activeTab === 'VAULTS' && renderVaultsTable()}
                  {activeTab === 'QUESTS' && renderQuestsTable()}
                  {activeTab === 'LESSONS' && renderLessonsTable()}
                  {activeTab === 'QUIZZES' && renderQuizzesTable()}
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
