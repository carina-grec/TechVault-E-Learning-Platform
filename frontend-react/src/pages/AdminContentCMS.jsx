import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import Input from '../components/Input.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const defaultVault = {
  title: '',
  description: '',
  theme: '',
  slug: '',
  category: '',
  difficulty: '',
  heroHighlight: '',
  mascotName: '',
  featured: false,
  status: 'DRAFT',
  displayOrder: 1,
};

const defaultQuest = {
  vaultId: '',
  type: 'CODE_CHALLENGE',
  title: '',
  order: 1,
  xpValue: 50,
  difficulty: 'Beginner',
  worldTheme: '',
  estimatedTime: '20m',
  description: '',
  language: 'javascript',
  starterCode: '',
  hints: '',
  gradingStrategy: 'UNIT_TEST',
  testCases: [],
};

export default function AdminContentCMS() {
  const { token } = useAuth();
  const [vaults, setVaults] = useState([]);
  const [quests, setQuests] = useState([]);
  const [vaultForm, setVaultForm] = useState(defaultVault);
  const [questForm, setQuestForm] = useState(defaultQuest);
  const [editingVaultId, setEditingVaultId] = useState(null);
  const [editingQuestId, setEditingQuestId] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadVaults();
    loadQuests();
  }, [token]);

  const loadVaults = async () => {
    try {
      const data = await api.getAdminVaults(token);
      setVaults(data || []);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const loadQuests = async (params = {}) => {
    try {
      const data = await api.getAdminQuests(token, params);
      setQuests(data || []);
    } catch (err) {
      setStatus(err.message);
    }
  };

  const saveVault = async () => {
    try {
      const payload = { ...vaultForm, displayOrder: Number(vaultForm.displayOrder) || 0 };
      if (editingVaultId) {
        await api.updateVault(token, editingVaultId, payload);
      } else {
        await api.createVault(token, payload);
      }
      setVaultForm(defaultVault);
      setEditingVaultId(null);
      loadVaults();
      setStatus('Vault saved.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const saveQuest = async () => {
    try {
      const payload = {
        ...questForm,
        order: Number(questForm.order) || 0,
        xpValue: Number(questForm.xpValue) || 0,
        testCases: questForm.testCases.map((tc) => ({
          ...tc,
          hidden: Boolean(tc.hidden),
        })),
      };
      if (editingQuestId) {
        await api.updateQuest(token, editingQuestId, payload);
      } else {
        await api.createQuest(token, payload);
      }
      setQuestForm(defaultQuest);
      setEditingQuestId(null);
      loadQuests();
      setStatus('Quest saved.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const addTestCase = () => {
    setQuestForm((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { description: '', input: '', expectedOutput: '', hidden: false }],
    }));
  };

  const updateTestCase = (index, field, value) => {
    setQuestForm((prev) => {
      const next = [...prev.testCases];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, testCases: next };
    });
  };

  const editVault = (vault) => {
    setEditingVaultId(vault.id);
    setVaultForm({
      title: vault.title,
      description: vault.description,
      theme: vault.theme,
      slug: vault.slug,
      category: vault.category,
      difficulty: vault.difficulty,
      heroHighlight: vault.heroHighlight,
      mascotName: vault.mascotName,
      featured: vault.featured,
      status: vault.status,
      displayOrder: vault.displayOrder,
    });
  };

  const editQuest = (quest) => {
    setEditingQuestId(quest.id);
    setQuestForm({
      ...defaultQuest,
      ...quest,
      testCases: quest.testCases || [],
    });
  };

  const deleteVault = async (id) => {
    try {
      await api.deleteVault(token, id);
      loadVaults();
    } catch (err) {
      setStatus(err.message);
    }
  };

  const deleteQuest = async (id) => {
    try {
      await api.deleteQuest(token, id);
      loadQuests();
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <MainLayout fullWidth>
      <Section
        title="Content management"
        description="Review and curate vaults, quests, and lessons."
        actions={<Button variant="accent" onClick={() => { setVaultForm(defaultVault); setEditingVaultId(null); }}>New vault</Button>}
      />
      {status && <p className="mb-4 text-sm text-mutedSilver">{status}</p>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-4">
          <Card title="Vault" subtitle={editingVaultId ? 'Update existing vault' : 'Create new vault'}>
            <div className="space-y-3 text-sm">
              <Input label="Title" value={vaultForm.title} onChange={(e) => setVaultForm({ ...vaultForm, title: e.target.value })} />
              <Input label="Description" value={vaultForm.description} onChange={(e) => setVaultForm({ ...vaultForm, description: e.target.value })} />
              <Input label="Slug" value={vaultForm.slug} onChange={(e) => setVaultForm({ ...vaultForm, slug: e.target.value })} />
              <Input label="Difficulty" value={vaultForm.difficulty} onChange={(e) => setVaultForm({ ...vaultForm, difficulty: e.target.value })} />
              <Input label="Display order" type="number" value={vaultForm.displayOrder} onChange={(e) => setVaultForm({ ...vaultForm, displayOrder: e.target.value })} />
              <label className="flex items-center gap-2 text-xs text-mutedSilver">
                <input type="checkbox" checked={vaultForm.featured} onChange={(e) => setVaultForm({ ...vaultForm, featured: e.target.checked })} /> Featured
              </label>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary" onClick={() => { setVaultForm(defaultVault); setEditingVaultId(null); }}>Reset</Button>
                <Button size="sm" variant="accent" onClick={saveVault}>Save</Button>
              </div>
            </div>
          </Card>
          <Card title="Quest" subtitle={editingQuestId ? 'Update quest' : 'Create quest'}>
            <div className="space-y-3 text-sm">
              <Input label="Vault ID" value={questForm.vaultId} onChange={(e) => setQuestForm({ ...questForm, vaultId: e.target.value })} />
              <Input label="Title" value={questForm.title} onChange={(e) => setQuestForm({ ...questForm, title: e.target.value })} />
              <Input label="Order" type="number" value={questForm.order} onChange={(e) => setQuestForm({ ...questForm, order: e.target.value })} />
              <Input label="XP value" type="number" value={questForm.xpValue} onChange={(e) => setQuestForm({ ...questForm, xpValue: e.target.value })} />
              <Input label="Difficulty" value={questForm.difficulty} onChange={(e) => setQuestForm({ ...questForm, difficulty: e.target.value })} />
              <Input label="Estimated time" value={questForm.estimatedTime} onChange={(e) => setQuestForm({ ...questForm, estimatedTime: e.target.value })} />
              <Input label="Language" value={questForm.language} onChange={(e) => setQuestForm({ ...questForm, language: e.target.value })} />
              <label className="flex flex-col gap-1 text-xs text-mutedSilver">
                Description
                <textarea className="rounded-md border border-onyx/20 bg-white p-2 text-onyx dark:border-mutedSilver/30 dark:bg-onyx dark:text-mutedSilver" value={questForm.description} onChange={(e) => setQuestForm({ ...questForm, description: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1 text-xs text-mutedSilver">
                Starter code
                <textarea className="rounded-md border border-onyx/20 bg-white p-2 font-mono text-xs text-onyx dark:border-mutedSilver/30 dark:bg-onyx dark:text-mutedSilver" value={questForm.starterCode} onChange={(e) => setQuestForm({ ...questForm, starterCode: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1 text-xs text-mutedSilver">
                Hints
                <textarea className="rounded-md border border-onyx/20 bg-white p-2 text-onyx dark:border-mutedSilver/30 dark:bg-onyx dark:text-mutedSilver" value={questForm.hints} onChange={(e) => setQuestForm({ ...questForm, hints: e.target.value })} />
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-onyx dark:text-softGold">Test cases</p>
                  <Button size="sm" variant="ghost" onClick={addTestCase}>Add</Button>
                </div>
                {questForm.testCases.map((tc, idx) => (
                  <div key={idx} className="rounded-md border border-onyx/10 p-2 dark:border-mutedSilver/20">
                    <Input label="Description" value={tc.description} onChange={(e) => updateTestCase(idx, 'description', e.target.value)} />
                    <Input label="Input" value={tc.input} onChange={(e) => updateTestCase(idx, 'input', e.target.value)} />
                    <Input label="Expected output" value={tc.expectedOutput} onChange={(e) => updateTestCase(idx, 'expectedOutput', e.target.value)} />
                    <label className="flex items-center gap-2 text-xs text-mutedSilver">
                      <input type="checkbox" checked={tc.hidden} onChange={(e) => updateTestCase(idx, 'hidden', e.target.checked)} /> Hidden
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="secondary" onClick={() => { setQuestForm(defaultQuest); setEditingQuestId(null); }}>Reset</Button>
                <Button size="sm" variant="accent" onClick={saveQuest}>Save quest</Button>
              </div>
            </div>
          </Card>
        </aside>

        <div className="space-y-6">
          <Card title="Vaults">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-mutedSilver">
                    <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Vault title</th>
                    <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Difficulty</th>
                    <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Status</th>
                    <th className="border-b border-onyx/10 pb-2 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vaults.map((item) => (
                    <tr key={item.id} className="border-b border-onyx/5 last:border-b-0">
                      <td className="py-3 pr-4 font-semibold text-onyx dark:text-softGold">{item.title}</td>
                      <td className="py-3 pr-4 text-mutedSilver">{item.difficulty}</td>
                      <td className="py-3 pr-4"><Badge variant={item.status === 'PUBLISHED' ? 'success' : 'neutral'}>{item.status}</Badge></td>
                      <td className="py-3 text-right flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => editVault(item)}>Edit</Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteVault(item.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Quests">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-mutedSilver">
                    <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Title</th>
                    <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Vault</th>
                    <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">XP</th>
                    <th className="border-b border-onyx/10 pb-2 pr-4 font-semibold">Status</th>
                    <th className="border-b border-onyx/10 pb-2 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quests.map((quest) => (
                    <tr key={quest.id} className="border-b border-onyx/5 last:border-b-0">
                      <td className="py-3 pr-4 font-semibold text-onyx dark:text-softGold">{quest.title}</td>
                      <td className="py-3 pr-4 text-mutedSilver">{quest.vaultId}</td>
                      <td className="py-3 pr-4 text-mutedSilver">{quest.xpValue}</td>
                      <td className="py-3 pr-4"><Badge variant={quest.status === 'PUBLISHED' ? 'success' : 'neutral'}>{quest.status}</Badge></td>
                      <td className="py-3 text-right flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => editQuest(quest)}>Edit</Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteQuest(quest.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
