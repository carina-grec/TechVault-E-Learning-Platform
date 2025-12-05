import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { Button } from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function GuardianDashboard() {
  const { token } = useAuth();
  const [learners, setLearners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [linkCode, setLinkCode] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!token) return;
    loadLearners();
  }, [token]);

  useEffect(() => {
    if (!selected || !token) return;
    loadProgress(selected.id);
    loadSubmissions(selected.id);
  }, [selected, token]);

  const loadLearners = async () => {
    try {
      const res = await api.getGuardianLearners(token);
      setLearners(res || []);
      setSelected((res || [])[0] || null);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadProgress = async (learnerId) => {
    try {
      const p = await api.getGuardianLearnerProgress(token, learnerId);
      setProgress(p);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadSubmissions = async (learnerId) => {
    try {
      const res = await api.getGuardianLearnerSubmissions(token, learnerId, { size: 5 });
      setSubmissions(res?.content || []);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleLink = async () => {
    try {
      setStatus(null);
      await api.linkGuardianLearner(token, { learnerIdentifier: linkCode });
      setLinkCode('');
      loadLearners();
      setStatus('Linked learner successfully.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <MainLayout>
      <Section
        title="Guardian Dashboard"
        description="Monitor your learners, celebrate their wins, and share guidance."
        actions={<Button variant="success" onClick={handleLink} disabled={!linkCode}>Link learner</Button>}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            className="w-full max-w-md rounded-md border border-onyx/20 px-3 py-2 text-sm focus:border-deepViolet focus:outline-none dark:border-mutedSilver/30 dark:bg-onyx dark:text-mutedSilver"
            placeholder="Enter learner code or email to link"
            value={linkCode}
            onChange={(e) => setLinkCode(e.target.value)}
          />
          {status && <span className="text-sm text-accentRose">{status}</span>}
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[320px,1fr]">
        <aside className="space-y-3">
          <p className="text-sm font-semibold text-onyx dark:text-softGold">Learners</p>
          <div className="space-y-3">
            {learners.map((child) => (
              <Card
                key={child.id}
                className={`cursor-pointer border ${selected?.id === child.id ? 'border-deepViolet' : 'border-transparent'}`}
                onClick={() => setSelected(child)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-onyx dark:text-softGold">{child.displayName || child.username}</p>
                    <p className="text-sm text-mutedSilver">Level {child.level} · {child.xp} XP</p>
                  </div>
                  <ProgressBar value={child.currentStreak ? Math.min(100, child.currentStreak * 5) : 0} className="w-24" />
                </div>
              </Card>
            ))}
            {learners.length === 0 && <p className="text-sm text-mutedSilver">No linked learners yet.</p>}
          </div>
        </aside>

        <section className="space-y-4">
          <Card title="Progress overview">
            {progress ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-mutedSilver">Level</p>
                  <p className="text-xl font-semibold text-onyx dark:text-softGold">{progress.level}</p>
                </div>
                <div>
                  <p className="text-mutedSilver">XP</p>
                  <p className="text-xl font-semibold text-onyx dark:text-softGold">{progress.xp}</p>
                </div>
                <div>
                  <p className="text-mutedSilver">Streak</p>
                  <p className="text-xl font-semibold text-onyx dark:text-softGold">{progress.streak} days</p>
                </div>
                <div>
                  <p className="text-mutedSilver">Completed quests</p>
                  <p className="text-xl font-semibold text-onyx dark:text-softGold">
                    {progress.completedQuests} / {progress.totalQuests}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-mutedSilver">Select a learner to view progress.</p>
            )}
          </Card>

          <Card title="Recent submissions">
            {submissions.length === 0 && <p className="text-sm text-mutedSilver">No submissions yet.</p>}
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub.submissionId} className="flex items-center justify-between rounded-md bg-sand/60 px-3 py-2 text-sm dark:bg-onyx/60">
                  <div>
                    <p className="font-semibold text-onyx dark:text-softGold">Quest {sub.questId}</p>
                    <p className="text-xs text-mutedSilver">Status: {sub.status}</p>
                  </div>
                  <Badge variant={sub.status === 'COMPLETED' ? 'success' : sub.status === 'PENDING' ? 'accent' : 'warning'}>
                    {sub.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}
