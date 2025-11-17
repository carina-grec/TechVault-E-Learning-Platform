import { useState } from 'react';
import SectionCard from './SectionCard';
import { useAuth } from '../context/AuthContext';

const emptySubmission = {
  questId: '',
  language: 'python',
  source: "print('Hello TechVault')",
  testCases: [],
};

function SubmissionsPanel() {
  const { request, auth } = useAuth();
  const [submissionForm, setSubmissionForm] = useState(emptySubmission);
  const [testCaseDraft, setTestCaseDraft] = useState({ description: '', input: '', expectedOutput: '' });
  const [submissions, setSubmissions] = useState([]);
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submissionIdLookup, setSubmissionIdLookup] = useState('');
  const [badgeCatalog, setBadgeCatalog] = useState([]);
  const [myBadges, setMyBadges] = useState([]);

  const submitCode = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      const payload = {
        questId: submissionForm.questId,
        language: submissionForm.language,
        source: submissionForm.source,
        testCases: submissionForm.testCases,
      };
      const response = await request('/api/submissions', { method: 'POST', data: payload });
      setStatus(`Submission queued with id ${response.submissionId}`);
      setSubmissionDetail(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const addTestCase = () => {
    if (!testCaseDraft.description || !testCaseDraft.expectedOutput) {
      return;
    }
    setSubmissionForm({
      ...submissionForm,
      testCases: [...submissionForm.testCases, testCaseDraft],
    });
    setTestCaseDraft({ description: '', input: '', expectedOutput: '' });
  };

  const fetchSubmissions = async () => {
    setError('');
    try {
      const data = await request('/api/submissions?size=20');
      setSubmissions(data.content || data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchSubmissionById = async () => {
    if (!submissionIdLookup) return;
    setError('');
    try {
      const data = await request(`/api/submissions/${submissionIdLookup}`);
      setSubmissionDetail(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBadges = async () => {
    setError('');
    try {
      const [catalog, mine] = await Promise.all([
        request('/api/badges/catalog', { skipAuth: true }),
        auth?.user ? request('/api/learner/badges') : Promise.resolve([]),
      ]);
      setBadgeCatalog(catalog);
      setMyBadges(mine || []);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SectionCard title="Submissions & Badges" description="Send code to the grader, inspect outputs, and view badge progress.">
      <form onSubmit={submitCode}>
        <input
          placeholder="Quest ID"
          value={submissionForm.questId}
          onChange={(e) => setSubmissionForm({ ...submissionForm, questId: e.target.value })}
        />
        <select value={submissionForm.language} onChange={(e) => setSubmissionForm({ ...submissionForm, language: e.target.value })}>
          <option value="python">python</option>
          <option value="java">java</option>
          <option value="javascript">javascript</option>
        </select>
        <textarea
          placeholder="Source code"
          value={submissionForm.source}
          onChange={(e) => setSubmissionForm({ ...submissionForm, source: e.target.value })}
        />
        <div style={{ border: '1px dashed #94a3b8', borderRadius: 8, padding: '0.75rem', marginTop: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>Test cases (optional)</h4>
          <input
            placeholder="Description"
            value={testCaseDraft.description}
            onChange={(e) => setTestCaseDraft({ ...testCaseDraft, description: e.target.value })}
          />
          <input
            placeholder="stdin input (e.g. '2 3')"
            value={testCaseDraft.input}
            onChange={(e) => setTestCaseDraft({ ...testCaseDraft, input: e.target.value })}
          />
          <input
            placeholder="Expected output"
            value={testCaseDraft.expectedOutput}
            onChange={(e) => setTestCaseDraft({ ...testCaseDraft, expectedOutput: e.target.value })}
          />
          <button className="btn secondary" type="button" onClick={addTestCase}>
            Add test case
          </button>
          {submissionForm.testCases.length > 0 && (
            <div className="json-preview">
              <pre>{JSON.stringify(submissionForm.testCases, null, 2)}</pre>
            </div>
          )}
        </div>
        <button className="btn" type="submit" style={{ marginTop: '0.5rem' }}>
          Submit Code
        </button>
      </form>

      <div className="button-row">
        <button className="btn secondary" onClick={fetchSubmissions}>
          Refresh My Submissions
        </button>
        <button className="btn" onClick={fetchBadges}>
          Refresh Badges
        </button>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label>Lookup submission by ID</label>
        <input value={submissionIdLookup} onChange={(e) => setSubmissionIdLookup(e.target.value)} placeholder="UUID" />
        <button className="btn secondary" type="button" onClick={fetchSubmissionById} style={{ marginTop: '0.4rem' }}>
          Fetch Submission
        </button>
      </div>

      {submissions.length > 0 && (
        <table style={{ marginTop: '0.75rem' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.submissionId}>
                <td>{s.submissionId}</td>
                <td>
                  <span className={`status-pill ${s.status === 'COMPLETED' && s.success ? 'success' : ''}`}>{s.status}</span>
                </td>
                <td>{s.score ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {submissionDetail && (
        <div className="json-preview">
          <pre>{JSON.stringify(submissionDetail, null, 2)}</pre>
        </div>
      )}

      {badgeCatalog.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <h3>Badge Catalog</h3>
          <div className="list" style={{ maxHeight: 180, overflow: 'auto' }}>
            {badgeCatalog.map((badge) => (
              <div key={badge.id} className="list-item">
                <strong>{badge.name}</strong>
                <div>{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {myBadges.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <h3>My Badges</h3>
          <div className="list">
            {myBadges.map((badge) => (
              <div key={badge.badgeId} className="list-item">
                <strong>{badge.name}</strong> – earned on {new Date(badge.unlockedAt).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}

      {status && <p className="success-text">{status}</p>}
      {error && <p className="error-text">{error}</p>}
    </SectionCard>
  );
}

export default SubmissionsPanel;
