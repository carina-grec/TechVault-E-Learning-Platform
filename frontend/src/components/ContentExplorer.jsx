import { useEffect, useState } from 'react';
import SectionCard from './SectionCard';
import { useAuth } from '../context/AuthContext';

const initialVaultForm = {
  title: '',
  description: '',
  theme: '',
  slug: '',
  category: '',
  difficulty: 'Beginner',
  heroHighlight: '',
  mascotName: '',
  featured: false,
  status: 'PUBLISHED',
  displayOrder: 1,
};

const initialQuestForm = {
  vaultId: '',
  type: 'CODE_CHALLENGE',
  title: '',
  order: 1,
  xpValue: 50,
  difficulty: 'Beginner',
  worldTheme: '',
  estimatedTime: '',
  description: '',
  language: 'python',
  starterCode: '',
  hints: '',
  gradingStrategy: 'UNIT_TEST',
};

function ContentExplorer() {
  const { request } = useAuth();
  const [vaults, setVaults] = useState([]);
  const [quests, setQuests] = useState([]);
  const [selectedVault, setSelectedVault] = useState('');
  const [questDetail, setQuestDetail] = useState(null);
  const [vaultForm, setVaultForm] = useState(initialVaultForm);
  const [questForm, setQuestForm] = useState(initialQuestForm);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const fetchVaults = async () => {
    setError('');
    try {
      const data = await request('/api/vaults', { skipAuth: true });
      setVaults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchQuests = async () => {
    setError('');
    try {
      const qs = new URLSearchParams();
      if (selectedVault) {
        qs.append('vaultId', selectedVault);
      }
      const data = await request(`/api/quests${qs.toString() ? `?${qs.toString()}` : ''}`, { skipAuth: true });
      setQuests(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVaults();
  }, []);

  const viewQuest = async (questId) => {
    setError('');
    try {
      const data = await request(`/api/quests/${questId}`, { skipAuth: true });
      setQuestDetail(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createVault = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      const payload = {
        ...vaultForm,
        featured: Boolean(vaultForm.featured),
        displayOrder: Number(vaultForm.displayOrder || 1),
      };
      const result = await request('/api/admin/vaults', { method: 'POST', data: payload });
      setStatus(`Created vault ${result.title}`);
      setVaultForm(initialVaultForm);
      fetchVaults();
    } catch (err) {
      setError(err.message);
    }
  };

  const createQuest = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');
    try {
      const payload = {
        ...questForm,
        order: Number(questForm.order || 1),
        xpValue: Number(questForm.xpValue || 50),
        vaultId: questForm.vaultId || null,
      };
      const result = await request('/api/admin/quests', { method: 'POST', data: payload });
      setStatus(`Created quest ${result.title}`);
      setQuestForm(initialQuestForm);
      fetchQuests();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SectionCard title="Content Explorer" description="Browse public vaults/quests, inspect data, and manage content as admin.">
      <div className="button-row">
        <button className="btn" onClick={fetchVaults}>
          Refresh Vaults
        </button>
        <button className="btn secondary" onClick={fetchQuests}>
          Refresh Quests
        </button>
      </div>

      <div className="list" style={{ maxHeight: 180, overflow: 'auto' }}>
        {vaults.map((vault) => (
          <div key={vault.id} className="list-item">
            <strong>{vault.title}</strong>
            <div style={{ fontSize: '0.8rem' }}>{vault.description}</div>
            <button className="btn secondary" style={{ marginTop: '0.35rem' }} onClick={() => setSelectedVault(vault.id)}>
              Target Vault
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <label>Select Vault for quest filtering</label>
        <select value={selectedVault} onChange={(e) => setSelectedVault(e.target.value)}>
          <option value="">All vaults</option>
          {vaults.map((v) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </select>
      </div>

      {quests.length > 0 && (
        <table style={{ marginTop: '0.75rem' }}>
          <thead>
            <tr>
              <th>Quest</th>
              <th>Type</th>
              <th>XP</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {quests.map((quest) => (
              <tr key={quest.id}>
                <td>{quest.title}</td>
                <td>{quest.questType}</td>
                <td>{quest.xpValue}</td>
                <td>
                  <button className="btn secondary" onClick={() => viewQuest(quest.id)}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {questDetail && (
        <div className="json-preview">
          <pre>{JSON.stringify(questDetail, null, 2)}</pre>
        </div>
      )}

      <form onSubmit={createVault} style={{ marginTop: '1rem' }}>
        <h3>Create Vault (Admin)</h3>
        {Object.keys(initialVaultForm).map((key) => {
          if (typeof initialVaultForm[key] === 'boolean') {
            return (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={vaultForm[key]}
                  onChange={(e) => setVaultForm({ ...vaultForm, [key]: e.target.checked })}
                />
                {key}
              </label>
            );
          }
          if (key === 'status') {
            return (
              <select key={key} value={vaultForm[key]} onChange={(e) => setVaultForm({ ...vaultForm, [key]: e.target.value })}>
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            );
          }
          return (
            <input
              key={key}
              placeholder={key}
              value={vaultForm[key]}
              onChange={(e) => setVaultForm({ ...vaultForm, [key]: e.target.value })}
            />
          );
        })}
        <button className="btn" type="submit">
          Create Vault
        </button>
      </form>

      <form onSubmit={createQuest} style={{ marginTop: '1rem' }}>
        <h3>Create Quest (Admin)</h3>
        {Object.entries(initialQuestForm).map(([key, value]) => {
          if (key === 'type') {
            return (
              <select key={key} value={questForm[key]} onChange={(e) => setQuestForm({ ...questForm, [key]: e.target.value })}>
                <option value="CODE_CHALLENGE">CODE_CHALLENGE</option>
                <option value="QUIZ">QUIZ</option>
                <option value="VIDEO">VIDEO</option>
              </select>
            );
          }
          if (key === 'gradingStrategy') {
            return (
              <select key={key} value={questForm[key]} onChange={(e) => setQuestForm({ ...questForm, [key]: e.target.value })}>
                <option value="UNIT_TEST">UNIT_TEST</option>
              </select>
            );
          }
          return (
            <input
              key={key}
              placeholder={key}
              value={questForm[key]}
              onChange={(e) => setQuestForm({ ...questForm, [key]: e.target.value })}
            />
          );
        })}
        <button className="btn secondary" type="submit">
          Create Quest
        </button>
      </form>

      {status && <p className="success-text">{status}</p>}
      {error && <p className="error-text">{error}</p>}
    </SectionCard>
  );
}

export default ContentExplorer;
