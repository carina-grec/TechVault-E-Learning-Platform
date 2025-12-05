import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Badge from '../components/Badge.jsx';

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api
      .getAdminUsers(token, { size: 50 })
      .then((res) => setUsers(res?.content || []))
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <MainLayout>
      <Section title="Users" description="Manage learners, guardians, and admins." />
      {error && <p className="text-accentRose">{error}</p>}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-mutedSilver">
                <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Email</th>
                <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Name</th>
                <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Role</th>
                <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">XP</th>
                <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Streak</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-onyx/5 last:border-b-0">
                  <td className="py-3 pr-4 text-onyx dark:text-softGold">{user.email}</td>
                  <td className="py-3 pr-4 text-mutedSilver">{user.username || user.email}</td>
                  <td className="py-3 pr-4">
                    <Badge variant="neutral">{user.role}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-mutedSilver">{user.xp ?? 0}</td>
                  <td className="py-3 pr-4 text-mutedSilver">{user.currentStreak ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-sm text-mutedSilver">No users found.</p>}
        </div>
      </Card>
    </MainLayout>
  );
}
