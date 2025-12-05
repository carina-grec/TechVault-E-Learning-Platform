import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import StatCard from '../components/StatCard.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { Button } from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function LearnerDashboard() {
  const { token, profile } = useAuth();
  const [summary, setSummary] = useState(null);
  const [badges, setBadges] = useState([]);
  const [vaults, setVaults] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    async function fetchData() {
      try {
        const [summaryRes, badgeRes, vaultRes, subs] = await Promise.all([
          api.getLearnerProgressSummary(token),
          api.getLearnerBadges(token),
          api.getVaults({ featured: true }, token),
          api.getRecentSubmissions(token, 5),
        ]);
        if (cancelled) return;
        setSummary(summaryRes);
        setBadges(badgeRes || []);
        setVaults(vaultRes || []);
        setSubmissions(subs || []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const completion = useMemo(() => {
    if (!summary) return 0;
    if (!summary.totalQuests) return 0;
    return Math.round((summary.completedQuests / summary.totalQuests) * 100);
  }, [summary]);

  if (loading) {
    return (
      <MainLayout>
        <div className="py-10 text-center text-mutedSilver">Loading your progress...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="py-10 text-center text-accentRose">Something went wrong: {error}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Section
        title={`Keep up the great work, ${profile?.displayName || 'Learner'}!`}
        description="Your learning streak is on fire—jump back into your quests."
        actions={<Button variant="accent" onClick={() => navigate('/vaults')}>Jump back in</Button>}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Current Level" value={summary?.level ?? '-'} />
          <StatCard label="Daily Streak" value={`${summary?.streak ?? 0} days`} hint="Keep the momentum!" />
          <StatCard label="Total XP" value={summary?.xp ?? 0} trend={summary?.completedQuests ?? 0} />
        </div>
      </Section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Quest completion">
            <ProgressBar value={completion} />
            <p className="mt-2 text-sm text-mutedSilver">
              {summary?.completedQuests ?? 0} of {summary?.totalQuests ?? 0} quests completed
            </p>
          </Card>

          <Section title="Your latest badges">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(badges || []).map((badge) => (
                <Card key={badge.badge.id} className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-softGold/70 text-charcoal">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {badge.badge.iconUrl || 'military_tech'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-onyx dark:text-softGold">{badge.badge.name}</p>
                    <p className="text-sm text-mutedSilver">{badge.badge.description}</p>
                  </div>
                </Card>
              ))}
              {badges?.length === 0 && <p className="text-mutedSilver text-sm">No badges yet—complete quests to earn some!</p>}
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          <Card title="Daily streak" subtitle="Stay consistent to earn bonus XP">
            <ProgressBar value={Math.min(100, (summary?.streak || 0) * 5)} />
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="success">+5 XP</Badge>
              <span className="text-sm text-mutedSilver">for tomorrow's check-in</span>
            </div>
          </Card>
          <Card title="Featured vaults" subtitle="Your next tasks">
            <ul className="space-y-3 text-sm">
              {vaults.map((vault) => (
                <li key={vault.id} className="flex items-center justify-between">
                  <span>{vault.title}</span>
                  <Button size="sm" variant="ghost" as={Link} to={`/vaults/${vault.id}`}>
                    Open
                  </Button>
                </li>
              ))}
              {vaults.length === 0 && <li className="text-mutedSilver">No featured vaults yet.</li>}
            </ul>
            <Button className="mt-4 w-full" variant="secondary" onClick={() => navigate('/vaults')}>
              Browse vaults
            </Button>
          </Card>
          <Card title="Recent submissions">
            <div className="space-y-3 text-sm">
              {submissions.map((submission) => (
                <div key={submission.submissionId} className="flex items-center justify-between rounded-md bg-sand/60 px-3 py-2 dark:bg-onyx/60">
                  <div>
                    <p className="font-semibold text-onyx dark:text-softGold">Quest {submission.questId}</p>
                    <p className="text-xs text-mutedSilver">Status: {submission.status}</p>
                  </div>
                  <Badge variant={submission.status === 'COMPLETED' ? 'success' : submission.status === 'PENDING' ? 'accent' : 'warning'}>
                    {submission.status}
                  </Badge>
                </div>
              ))}
              {submissions.length === 0 && <p className="text-mutedSilver">No submissions yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
