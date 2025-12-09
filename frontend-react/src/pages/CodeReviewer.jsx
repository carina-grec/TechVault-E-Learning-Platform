import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CodeReviewer() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api
      .getSubmissions(token, { size: 10 })
      .then((res) => {
        const items = res?.content || [];
        setSubmissions(items);
        setSelected(items[0] || null);
      })
      .catch((err) => setError(err.message));
  }, [token]);

  const parsedResults = useMemo(() => {
    if (!selected?.resultsJson) return null;
    try {
      return JSON.parse(selected.resultsJson);
    } catch {
      return null;
    }
  }, [selected]);

  return (
    <MainLayout fullWidth>
      <Section
        title="Submission review"
        description="Inspect outputs, grading results, and feedback."
        actions={<Button variant="accent" onClick={() => window.history.back()}>Back</Button>}
      >
        <div className="flex flex-wrap gap-2">
          {selected && <Badge variant={selected.status === 'COMPLETED' ? 'success' : 'warning'}>{selected.status}</Badge>}
          {selected?.timestamp && <Badge variant="info">{new Date(selected.timestamp).toLocaleString()}</Badge>}
        </div>
      </Section>

      {error && <p className="text-red-600">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Submissions">
          <div className="space-y-2 text-sm">
            {submissions.map((sub) => (
              <button
                key={sub.submissionId}
                className={`w-full rounded-md border px-3 py-2 text-left ${selected?.submissionId === sub.submissionId ? 'border-deepViolet bg-sand/60 dark:bg-onyx' : 'border-onyx/10'}`}
                onClick={() => setSelected(sub)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-onyx dark:text-softGold">Quest {sub.questId}</span>
                  <Badge variant={sub.status === 'COMPLETED' ? 'success' : 'warning'}>{sub.status}</Badge>
                </div>
                <p className="text-xs text-mutedSilver">{new Date(sub.timestamp).toLocaleString()}</p>
              </button>
            ))}
            {submissions.length === 0 && <p className="text-mutedSilver">No submissions to review.</p>}
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="Results">
            {selected ? (
              <div className="space-y-2 text-sm text-mutedSilver">
                <p>Quest ID: {selected.questId}</p>
                <p>Score: {selected.score ?? 'n/a'}</p>
                {selected.stdout && <pre className="rounded bg-sand/60 p-2 text-xs text-onyx dark:bg-onyx dark:text-mutedSilver">{selected.stdout}</pre>}
                {selected.stderr && <pre className="rounded bg-accentRose/10 p-2 text-xs text-onyx dark:bg-onyx dark:text-red-600">{selected.stderr}</pre>}
              </div>
            ) : (
              <p className="text-mutedSilver">Select a submission to review.</p>
            )}
          </Card>
          <Card title="Test cases">
            {parsedResults?.results ? (
              <div className="space-y-2 text-sm">
                {parsedResults.results.map((r, idx) => (
                  <div key={idx} className="rounded-md border border-onyx/10 p-2 dark:border-mutedSilver/20">
                    <div className="flex items-center justify-between text-xs">
                      <span>{r.description || `Case ${idx + 1}`}</span>
                      <Badge variant={r.passed ? 'success' : 'warning'}>{r.passed ? 'Passed' : 'Failed'}</Badge>
                    </div>
                    <p className="text-xs text-mutedSilver">Expected: {r.expectedOutput}</p>
                    <p className="text-xs text-mutedSilver">Actual: {r.actualOutput}</p>
                    {r.error && <p className="text-xs text-red-600">Error: {r.error}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-mutedSilver text-sm">No test results available.</p>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
