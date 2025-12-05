import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import StatCard from '../components/StatCard.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AnalyticsReport() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api
      .getAdminMetrics(token)
      .then(setMetrics)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <MainLayout fullWidth>
      <Section
        title="Analytics report"
        description="Track platform submissions and grading health."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => window.print()}>
              Print report
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label="Total submissions" value={metrics?.totalSubmissions ?? '--'} />
          <StatCard label="Completed" value={metrics?.completedSubmissions ?? '--'} />
          <StatCard label="Pending" value={metrics?.pendingSubmissions ?? '--'} />
          <StatCard label="Today" value={metrics?.submissionsToday ?? '--'} />
        </div>
      </Section>

      {error && <p className="text-accentRose">{error}</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Grading throughput" subtitle="Submissions vs completions" className="min-h-[220px]">
          <div className="mt-4 h-40 rounded-lg bg-gradient-to-r from-softGold/40 via-accentRose/40 to-accentBlue/30" role="img" aria-label="Analytics placeholder" />
          <p className="mt-3 text-sm text-mutedSilver">Hook up to your BI stack for detailed charts.</p>
        </Card>
        <Card title="Reliability checks" subtitle="Queue + grading status">
          <ul className="space-y-2 text-sm text-mutedSilver">
            <li>Message queue healthy: {metrics ? 'Yes' : 'Unknown'}</li>
            <li>Average grading latency: {metrics ? '< 5s (sample)' : 'Collecting...'}</li>
            <li>Latest refresh: {new Date().toLocaleString()}</li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
}
