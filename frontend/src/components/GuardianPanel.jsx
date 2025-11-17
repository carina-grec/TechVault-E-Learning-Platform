import { useState } from 'react';
import SectionCard from './SectionCard';
import { useAuth } from '../context/AuthContext';

function GuardianPanel() {
  const { request, auth } = useAuth();
  const [linkedLearners, setLinkedLearners] = useState([]);
  const [learnerIdentifier, setLearnerIdentifier] = useState('');
  const [targetLearnerId, setTargetLearnerId] = useState('');
  const [progressSummary, setProgressSummary] = useState(null);
  const [learnerSubmissions, setLearnerSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const loadLinkedLearners = async () => {
    setError('');
    try {
      const data = await request('/api/guardians/me/learners');
      setLinkedLearners(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const linkLearner = async () => {
    if (!learnerIdentifier) return;
    setStatus('');
    setError('');
    try {
      const response = await request('/api/guardians/me/learners', {
        method: 'POST',
        data: { learnerIdentifier },
      });
      setStatus(`Linked learner ${response.learnerId}`);
      setLearnerIdentifier('');
      loadLinkedLearners();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProgress = async () => {
    if (!targetLearnerId) return;
    setError('');
    try {
      const summary = await request(`/api/guardian/learners/${targetLearnerId}/progress`);
      setProgressSummary(summary);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchLearnerSubmissions = async () => {
    if (!targetLearnerId) return;
    setError('');
    try {
      const submissions = await request(`/api/guardian/learners/${targetLearnerId}/submissions`);
      setLearnerSubmissions(submissions.content || submissions);
    } catch (err) {
      setError(err.message);
    }
  };

  if (auth?.user?.role !== 'GUARDIAN') {
    return (
      <SectionCard title="Guardian Tools" description="Login as a guardian to monitor linked learners.">
        <p>Guardian role required.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Guardian Tools" description="Link learners, monitor their progress, and inspect their submissions.">
      <div className="button-row">
        <button className="btn" onClick={loadLinkedLearners}>
          Load Linked Learners
        </button>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
          <label>Link learner by email/username</label>
          <input value={learnerIdentifier} onChange={(e) => setLearnerIdentifier(e.target.value)} placeholder="Email or username" />
          <button className="btn secondary" type="button" onClick={linkLearner} style={{ marginTop: '0.3rem' }}>
            Link Learner
          </button>
      </div>

      {linkedLearners.length > 0 && (
        <div className="list" style={{ marginTop: '0.5rem' }}>
          {linkedLearners.map((learner) => (
            <div key={learner.learnerId} className="list-item">
              <strong>{learner.displayName || learner.learnerId}</strong>
              <div>{learner.email}</div>
              <button className="btn secondary" style={{ marginTop: '0.35rem' }} onClick={() => setTargetLearnerId(learner.learnerId)}>
                Select learner
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '0.75rem' }}>
        <label>Target learner ID</label>
        <input value={targetLearnerId} onChange={(e) => setTargetLearnerId(e.target.value)} placeholder="UUID" />
        <div className="button-row" style={{ marginTop: '0.5rem' }}>
          <button className="btn" onClick={fetchProgress}>
            Fetch Progress
          </button>
          <button className="btn secondary" onClick={fetchLearnerSubmissions}>
            Fetch Submissions
          </button>
        </div>
      </div>

      {progressSummary && (
        <div className="json-preview">
          <pre>{JSON.stringify(progressSummary, null, 2)}</pre>
        </div>
      )}

      {learnerSubmissions.length > 0 && (
        <table style={{ marginTop: '0.75rem' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {learnerSubmissions.map((s) => (
              <tr key={s.submissionId}>
                <td>{s.submissionId}</td>
                <td>{s.status}</td>
                <td>{s.score ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {status && <p className="success-text">{status}</p>}
      {error && <p className="error-text">{error}</p>}
    </SectionCard>
  );
}

export default GuardianPanel;
