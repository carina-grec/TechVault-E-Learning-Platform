import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';

export default function UserSettings() {
  const { token, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [preferredMascot, setPreferredMascot] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setAvatarUrl(profile.avatarUrl || '');
      setPreferredMascot(profile.preferredMascot || '');
    }
  }, [profile]);

  const saveProfile = async () => {
    try {
      await api.updateProfile(token, {
        displayName,
        avatarUrl,
        preferredMascot,
        settings: profile?.settings || {},
      });
      setStatus('Profile updated');
      refreshProfile();
    } catch (err) {
      setStatus(err.message);
    }
  };

  const savePassword = async () => {
    try {
      await api.changePassword(token, { currentPassword, newPassword });
      setStatus('Password changed');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <MainLayout>
      {status && <p className="mb-4 text-sm text-mutedSilver">{status}</p>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Profile">
          <div className="space-y-4">
            <Input id="settings-name" label="Display name" placeholder="Alex Coder" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Input id="settings-avatar" label="Avatar URL" placeholder="https://..." value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            <Input id="settings-mascot" label="Preferred mascot" placeholder="Pixel Fox" value={preferredMascot} onChange={(e) => setPreferredMascot(e.target.value)} />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => refreshProfile()}>Reset</Button>
            <Button variant="success" onClick={saveProfile}>Save profile</Button>
          </div>
        </Card>
        <Card title="Security">
          <div className="space-y-4">
            <Input id="settings-current" label="Current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <Input id="settings-new" label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="accent" onClick={savePassword}>Change password</Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
