import { useState } from 'react';
import SectionCard from './SectionCard';
import { useAuth } from '../context/AuthContext';

const initialUserUpdate = {
  userId: '',
  role: '',
  status: '',
  displayName: '',
};

function AdminPanel() {
  const { auth, request } = useAuth();
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [filters, setFilters] = useState({ page: 0, role: '' });
  const [updateForm, setUpdateForm] = useState(initialUserUpdate);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  if (auth?.user?.role !== 'ADMIN') {
    return (
      <SectionCard title="Admin Console" description="Login as an admin to manage users and review platform metrics.">
        <p>Admin role required.</p>
      </SectionCard>
    );
  }

  const loadUsers = async () => {
    setError('');
    try {
      const qs = new URLSearchParams({ page: filters.page.toString(), size: '20' });
      if (filters.role) qs.append('role', filters.role);
      const data = await request(`/api/admin/users?${qs.toString()}`);
      setUsers(data.content || data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchMetrics = async () => {
    setError('');
    try {
      const overview = await request('/api/admin/metrics/overview');
      setMetrics(overview);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateUser = async (event) => {
    event.preventDefault();
    if (!updateForm.userId) return;
    setStatus('');
    setError('');
    try {
      const payload = {
        role: updateForm.role || null,
        status: updateForm.status || null,
        displayName: updateForm.displayName || null,
      };
      const updated = await request(`/api/admin/users/${updateForm.userId}`, {
        method: 'PATCH',
        data: payload,
      });
      setStatus(`Updated ${updated.email}`);
      setUpdateForm(initialUserUpdate);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SectionCard title="Admin Console" description="List users, adjust roles/status, and monitor grading metrics.">
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          placeholder="Page"
          type="number"
          value={filters.page}
          onChange={(e) => setFilters({ ...filters, page: Number(e.target.value || 0) })}
        />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">Any role</option>
          <option value="LEARNER">Learner</option>
          <option value="GUARDIAN">Guardian</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button className="btn" type="button" onClick={loadUsers}>
          Load Users
        </button>
        <button className="btn secondary" type="button" onClick={fetchMetrics}>
          Refresh Metrics
        </button>
      </div>

      {users.length > 0 && (
        <table style={{ marginTop: '0.75rem' }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={updateUser} style={{ marginTop: '0.75rem' }}>
        <h3>Update User</h3>
        <input
          placeholder="User ID"
          value={updateForm.userId}
          onChange={(e) => setUpdateForm({ ...updateForm, userId: e.target.value })}
        />
        <select value={updateForm.role} onChange={(e) => setUpdateForm({ ...updateForm, role: e.target.value })}>
          <option value="">Role unchanged</option>
          <option value="LEARNER">Learner</option>
          <option value="GUARDIAN">Guardian</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={updateForm.status} onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}>
          <option value="">Status unchanged</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="PENDING_CONSENT">PENDING_CONSENT</option>
          <option value="SUSPENDED">SUSPENDED</option>
        </select>
        <input
          placeholder="Display name"
          value={updateForm.displayName}
          onChange={(e) => setUpdateForm({ ...updateForm, displayName: e.target.value })}
        />
        <button className="btn secondary" type="submit">
          Update
        </button>
      </form>

      {metrics && (
        <div className="json-preview">
          <pre>{JSON.stringify(metrics, null, 2)}</pre>
        </div>
      )}

      {status && <p className="success-text">{status}</p>}
      {error && <p className="error-text">{error}</p>}
    </SectionCard>
  );
}

export default AdminPanel;
