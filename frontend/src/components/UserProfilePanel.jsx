import { useState } from 'react';
import SectionCard from './SectionCard';
import { useAuth } from '../context/AuthContext';

const profileDefaults = {
  displayName: '',
  avatarUrl: '',
  preferredMascot: '',
};

function UserProfilePanel() {
  const { request, auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(profileDefaults);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  if (!auth?.token) {
    return (
      <SectionCard title="Profile" description="Login to view and edit your profile.">
        <p>No active session.</p>
      </SectionCard>
    );
  }

  const loadProfile = async () => {
    setError('');
    try {
      const data = await request('/api/users/me');
      setProfile(data);
      setProfileForm({
        displayName: data.displayName || '',
        avatarUrl: data.avatarUrl || '',
        preferredMascot: data.preferredMascot || '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      const payload = {
        ...profileForm,
        settings: {},
      };
      const updated = await request('/api/users/me', { method: 'PATCH', data: payload });
      setProfile(updated);
      setStatus('Profile updated');
    } catch (err) {
      setError(err.message);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      await request('/api/users/me/password', { method: 'PATCH', data: passwordForm });
      setStatus('Password changed');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SectionCard title="Profile" description="View and update profile data + change password.">
      <div className="button-row">
        <button className="btn" onClick={loadProfile}>
          Load Profile
        </button>
      </div>
      {profile && (
        <div className="json-preview">
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      <form onSubmit={updateProfile} style={{ marginTop: '0.75rem' }}>
        <h3>Update Profile</h3>
        <input
          placeholder="Display name"
          value={profileForm.displayName}
          onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
        />
        <input
          placeholder="Avatar URL"
          value={profileForm.avatarUrl}
          onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
        />
        <input
          placeholder="Preferred mascot"
          value={profileForm.preferredMascot}
          onChange={(e) => setProfileForm({ ...profileForm, preferredMascot: e.target.value })}
        />
        <button className="btn secondary" type="submit">
          Save Profile
        </button>
      </form>

      <form onSubmit={changePassword} style={{ marginTop: '0.75rem' }}>
        <h3>Change Password</h3>
        <input
          placeholder="Current password"
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
        />
        <input
          placeholder="New password"
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
        />
        <button className="btn" type="submit">
          Update Password
        </button>
      </form>

      {status && <p className="success-text">{status}</p>}
      {error && <p className="error-text">{error}</p>}
    </SectionCard>
  );
}

export default UserProfilePanel;
