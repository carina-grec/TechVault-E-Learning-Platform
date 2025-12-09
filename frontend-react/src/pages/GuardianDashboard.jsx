import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/Modal.jsx';

export default function GuardianDashboard() {
  const { token, profile } = useAuth();
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [childEmail, setChildEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    loadLearners();
  }, [token]);

  const loadLearners = async () => {
    try {
      setIsLoading(true);
      const res = await api.getGuardianLearners(token);
      setLearners(res || []);
      // If we have learners, select the first one by default if none selected
      if (res && res.length > 0 && !selected) {
        setSelected(res[0]);
      }
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLink = async () => {
    if (!childEmail) return;
    try {
      setStatus(null);
      await api.linkGuardianLearner(token, { learnerIdentifier: childEmail });
      setChildEmail('');
      await loadLearners();
      setStatus({ type: 'success', message: 'Learner linked successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  // Neo-Brutalist Card Helper
  const LearnerCard = ({ learner, onClick, isSelected }) => (
    <div
      onClick={onClick}
      className={`flex flex-col gap-4 text-left p-6 bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-200 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${isSelected ? 'ring-2 ring-lime-400' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 bg-center bg-no-repeat aspect-square bg-cover rounded-full border-2 border-slate-900 dark:border-slate-200"
          style={{ backgroundImage: `url("https://api.dicebear.com/7.x/bottts/svg?seed=${learner.username}")` }}
        ></div>
        <div>
          <h3 className="text-slate-900 dark:text-white text-2xl font-bold">{learner.displayName || learner.username}</h3>
          <p className="text-sm text-slate-500">Level {learner.level}</p>
        </div>
      </div>
      <div className="font-display text-sm space-y-3">
        <div className="flex flex-col">
          <p className="text-slate-500 dark:text-slate-400">Current Course:</p>
          <p className="text-slate-900 dark:text-white font-medium">Python Basics</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-slate-500 dark:text-slate-400">XP Progress:</p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 border border-slate-900 dark:border-slate-200">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((learner.xp / 1000) * 100, 100)}%` }}></div>
          </div>
          <span className="text-xs text-right">{learner.xp} XP</span>
        </div>
      </div>
      <button className="mt-2 w-full flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 text-sm font-bold border-2 border-slate-900 dark:border-slate-200">
        <span className="truncate">View Details</span>
      </button>
    </div>
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden font-display">
      <div className="layout-container flex h-full grow flex-col">
        {/* Custom Header matching code.html somewhat, but integrating into MainLayout usually implies keeping the MainLayout nav. 
             However, the reference has a specific header. For consistency with previous phases, we might want to put this INSIDE MainLayout 
             but override some padding or just use the content area. 
             Let's use MainLayout for Nav consistency but style the content body to match.
         */}
        <MainLayout fullWidth={true}>
          <div className="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
            <div className="layout-content-container flex w-full max-w-6xl flex-col flex-1">

              {/* Internal Page Header */}
              <header className="flex items-center justify-between whitespace-nowrap border-b-2 border-slate-900 dark:border-slate-200 pb-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="size-8 text-slate-900 dark:text-slate-200">
                    <span className="material-symbols-outlined text-3xl">shield_person</span>
                  </div>
                  <h2 className="text-slate-900 dark:text-slate-200 text-2xl font-bold tracking-[-0.015em]">Guardian Portal</h2>
                </div>

                {/* Link Learner Input Area (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                  <input
                    type="email"
                    placeholder="Enter child's email..."
                    value={childEmail}
                    onChange={(e) => setChildEmail(e.target.value)}
                    className="h-10 px-3 rounded-lg border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400 w-64"
                  />
                  <button
                    onClick={handleLink}
                    disabled={!childEmail}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-lime-400 text-slate-900 text-sm font-bold border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                  >
                    Add Child
                  </button>
                </div>
              </header>

              <main className="flex flex-col gap-8">
                {/* Status Messages */}
                {status && (
                  <div className={`p-4 border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${status.type === 'error' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`}>
                    <p className="font-bold">{status.message || status}</p>
                  </div>
                )}

                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-slate-900 dark:text-slate-200 text-4xl md:text-5xl font-bold tracking-tighter">Your Learners</h1>
                    <p className="font-body text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
                      Welcome back, {profile?.username || 'Guardian'}! Track your children's progress here.
                    </p>
                  </div>
                  {/* Mobile Link Input */}
                  <div className="flex md:hidden w-full gap-2">
                    <input
                      type="text"
                      placeholder="Code..."
                      value={childEmail}
                      onChange={(e) => setChildEmail(e.target.value)}
                      className="flex-1 h-10 px-3 rounded-lg border-2 border-slate-900"
                    />
                    <button onClick={handleLink} className="bg-lime-400 text-slate-900 font-bold px-4 rounded-lg border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Add</button>
                  </div>
                </div>

                {/* Learners Grid */}
                {isLoading ? (
                  <div className="text-center py-20 text-slate-500">Loading learners...</div>
                ) : learners.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {learners.map(l => (
                      <LearnerCard
                        key={l.id}
                        learner={l}
                        onClick={() => setSelected(l)}
                        isSelected={selected?.id === l.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col p-4 mt-8">
                    <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-slate-400 px-6 py-14">
                      <div className="flex max-w-[480px] flex-col items-center gap-2">
                        <p className="text-slate-900 dark:text-white text-lg font-bold tracking-[-0.015em] max-w-[480px] text-center">No profiles linked yet.</p>
                        <p className="text-slate-600 dark:text-slate-400 font-body text-sm font-normal leading-normal max-w-[480px] text-center">
                          Get started by adding your first child's profile code above to track their progress.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Progress Section (If selected) */}
                {/* Learner Details Modal */}
                <Modal
                  isOpen={!!selected}
                  onClose={() => setSelected(null)}
                  title="Learner Details"
                >
                  {selected && (
                    <div className="flex flex-col gap-6">
                      {/* Identity Section */}
                      <div className="flex items-center gap-4 border-b-2 border-slate-100 dark:border-slate-800 pb-4">
                        <div
                          className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-full border-2 border-slate-900 dark:border-lime-400 shadow-[2px_2px_0px_#000]"
                          style={{ backgroundImage: `url("https://api.dicebear.com/7.x/bottts/svg?seed=${selected.username}")` }}
                        ></div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selected.displayName}</h3>
                          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">{selected.email}</p>

                        </div>
                      </div>

                      {/* Detailed Statistics Container (Moved as requested) */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Detailed Statistics for {selected.displayName}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded border-2 border-slate-200 dark:border-slate-700">
                            <span className="block text-slate-500 dark:text-slate-400 text-sm">Total XP</span>
                            <span className="block text-xl font-bold text-slate-900 dark:text-white">{selected.xp}</span>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded border-2 border-slate-200 dark:border-slate-700">
                            <span className="block text-slate-500 dark:text-slate-400 text-sm">Streak</span>
                            <span className="block text-xl font-bold text-slate-900 dark:text-white">{selected.currentStreak || 0} Days</span>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded border-2 border-slate-200 dark:border-slate-700">
                            <span className="block text-slate-500 dark:text-slate-400 text-sm">Level</span>
                            <span className="block text-xl font-bold text-slate-900 dark:text-white">{selected.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Modal>
              </main>
            </div>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}
