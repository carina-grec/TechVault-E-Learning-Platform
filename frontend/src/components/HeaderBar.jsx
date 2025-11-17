import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function HeaderBar() {
  const { baseUrl, setBaseUrl, auth, logout } = useAuth();
  const [draftBase, setDraftBase] = useState(baseUrl);

  const handleBlur = () => {
    if (draftBase && draftBase !== baseUrl) {
      setBaseUrl(draftBase.trim());
    }
  };

  return (
    <header className="header-bar">
      <div>
        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem' }}>API Gateway URL</label>
        <input
          type="text"
          value={draftBase}
          onChange={(e) => setDraftBase(e.target.value)}
          onBlur={handleBlur}
          placeholder="http://localhost:8081"
        />
      </div>
      <div className="user-info">
        {auth?.user ? (
          <>
            <strong>{auth.user.displayName || auth.user.email}</strong>
            <span>
              {auth.user.role} • {auth.user.id}
            </span>
            <button className="btn secondary" style={{ marginTop: '0.35rem', padding: '0.3rem 0.6rem' }} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <span>No session</span>
        )}
      </div>
    </header>
  );
}

export default HeaderBar;
