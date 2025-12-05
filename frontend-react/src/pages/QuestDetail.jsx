import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function QuestDetail() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [quest, setQuest] = useState(null);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!questId) return;
    let cancelled = false;
    api
      .getQuest(questId, token)
      .then((q) => {
        if (cancelled) return;
        setQuest(q);
        setCode(q?.starterCode || '');
      })
      .catch((err) => setStatus(err.message));

    return () => {
      cancelled = true;
    };
  }, [questId, token]);

  useEffect(() => {
    if (!submission || !token) return;
    if (!['PENDING', 'GRADING'].includes(submission.status)) return;

    const timer = setInterval(async () => {
      try {
        const refreshed = await api.getSubmission(token, submission.submissionId);
        setSubmission(refreshed);
      } catch (err) {
        setStatus(err.message);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [submission, token]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const payload = {
        questId,
        source: code,
        language: quest?.language || 'javascript',
      };
      const res = await api.submitQuest(token, payload);
      setSubmission(res);
      setStatus('Submission sent. Grading in progress...');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedResults = useMemo(() => {
    if (!submission?.resultsJson) return null;
    try {
      return JSON.parse(submission.resultsJson);
    } catch {
      return null;
    }
  }, [submission]);

  if (!quest) {
    return (
      <MainLayout>
        <div className="py-10 text-center text-mutedSilver">Loading quest...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout fullWidth>
      <Section
        title={`Quest: ${quest.title}`}
        description={quest.description || quest.questType}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="accent" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        }
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Instructions" subtitle={`${quest.difficulty || 'Beginner'} · ${quest.language || 'Language'}`} className="space-y-4">
          <p className="text-base leading-relaxed text-onyx dark:text-mutedSilver">{quest.description}</p>
          <div className="space-y-2 text-sm text-mutedSilver">
            <p>Estimated time: {quest.estimatedTime || '15m'}</p>
            <p>XP reward: {quest.xpValue} XP</p>
          </div>
          {quest.hints && (
            <div className="rounded-md bg-sand/60 p-3 text-sm text-onyx dark:bg-onyx dark:text-mutedSilver">
              <p className="font-semibold text-onyx dark:text-softGold">Hints</p>
              <p>{quest.hints}</p>
            </div>
          )}
          <div className="space-y-2">
            <h4 className="font-semibold text-onyx dark:text-softGold">Test cases</h4>
            <div className="flex flex-wrap gap-2">
              {(quest.testCases || []).map((tc, idx) => (
                <Badge key={tc.id || idx} variant={tc.hidden ? 'neutral' : 'success'}>
                  {tc.description || `Case ${idx + 1}`} {tc.hidden ? '(hidden)' : ''}
                </Badge>
              ))}
              {(!quest.testCases || quest.testCases.length === 0) && <span className="text-sm text-mutedSilver">No test cases defined.</span>}
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card title="Code editor" className="bg-onyx text-mutedSilver font-mono">
            <textarea
              className="min-h-[280px] w-full rounded-md bg-onyx/80 p-3 text-sm focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Card>
          <Card title="Results" className="space-y-3">
            {status && <p className="text-sm text-mutedSilver">{status}</p>}
            {submission && (
              <div className="text-sm text-mutedSilver space-y-2">
                <p>Status: <Badge variant={submission.status === 'COMPLETED' ? 'success' : submission.status === 'PENDING' ? 'accent' : 'warning'}>{submission.status}</Badge></p>
                {submission.score != null && <p>Score: {submission.score}</p>}
                {submission.stdout && <pre className="rounded bg-sand/60 p-2 text-xs text-onyx dark:bg-onyx dark:text-mutedSilver">{submission.stdout}</pre>}
                {submission.stderr && <pre className="rounded bg-accentRose/10 p-2 text-xs text-onyx dark:bg-onyx dark:text-accentRose">{submission.stderr}</pre>}
                {parsedResults?.results && (
                  <div className="space-y-2">
                    <p className="font-semibold text-onyx dark:text-softGold">Test cases</p>
                    {parsedResults.results.map((r, idx) => (
                      <div key={idx} className="rounded-md border border-onyx/10 p-2 dark:border-mutedSilver/20">
                        <div className="flex items-center justify-between text-xs">
                          <span>{r.description || `Case ${idx + 1}`}</span>
                          <Badge variant={r.passed ? 'success' : 'warning'}>{r.passed ? 'Passed' : 'Failed'}</Badge>
                        </div>
                        <p className="text-xs text-mutedSilver">Expected: {r.expectedOutput}</p>
                        <p className="text-xs text-mutedSilver">Actual: {r.actualOutput}</p>
                        {r.stderr && <p className="text-xs text-accentRose">Error: {r.stderr}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
