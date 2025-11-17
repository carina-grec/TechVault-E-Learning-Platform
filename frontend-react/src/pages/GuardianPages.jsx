export function GuardianDashboard({ learners = [], navigate }) {
  return (
    <div className="content-shell">
      <section className="card">
        <h2>Your learners</h2>
        <div className="grid two">
          {learners.map((learner) => (
            <article key={learner.id} className="card">
              <h3>{learner.name}</h3>
              <p>Focus: {learner.focus}</p>
              <p>Badges unlocked: {learner.badgesUnlocked}</p>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.round(
                      (learner.vaultProgress[0]?.completed ?? 0) /
                        (learner.vaultProgress[0]?.total ?? 1) *
                        100,
                    )}%`,
                  }}
                />
              </div>
              <button className="btn btn-secondary" onClick={() => navigate(`/guardian/learners/${learner.id}`)}>
                View progress
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export function GuardianLearnerPage({ learner }) {
  if (!learner) {
    return (
      <div className="content-shell">
        <div className="empty-state">Learner not found.</div>
      </div>
    )
  }
  return (
    <div className="content-shell">
      <section className="card">
        <h2>{learner.name}</h2>
        <p>Tracking focus: {learner.focus}</p>
        <p>Next badge: {learner.nextBadge}</p>
      </section>
      <section className="card">
        <h3>Vault progress</h3>
        <div className="grid two">
          {learner.vaultProgress.map((progress) => (
            <article key={progress.vaultId}>
              <strong>{progress.title}</strong>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.round((progress.completed / progress.total) * 100)}%` }}
                />
              </div>
              <small>
                {progress.completed}/{progress.total} quests
              </small>
            </article>
          ))}
        </div>
      </section>
      <section className="card">
        <h3>Recent submissions</h3>
        {learner.submissions.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Quest</th>
                <th>Status</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {learner.submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.questTitle}</td>
                  <td>
                    <span className={`status-pill ${submission.status === 'PENDING' ? 'pending' : submission.result?.toLowerCase() ?? 'draft'}`}>
                      {submission.status === 'PENDING' ? 'Pending' : submission.result}
                    </span>
                  </td>
                  <td>{submission.score ?? '--'}</td>
                  <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No submissions yet.</div>
        )}
      </section>
    </div>
  )
}
