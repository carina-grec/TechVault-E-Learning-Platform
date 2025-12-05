import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { Button } from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function VaultDetail() {
  const { vaultId } = useParams();
  const { token } = useAuth();
  const [detail, setDetail] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!vaultId) return;
    loadVault();
  }, [vaultId, token]);

  const loadVault = async () => {
    try {
      const [vaultRes, vaultProgress] = await Promise.all([
        api.getVaultDetail(vaultId, token),
        api.getLearnerVaultProgress(token),
      ]);
      setDetail(vaultRes);
      const p = (vaultProgress || []).find((v) => v.vaultId === vaultId || v.vaultId === vaultRes?.vault?.id);
      setProgress(p || null);
    } catch (err) {
      setError(err.message);
    }
  };

  const completion = useMemo(() => {
    if (!progress || !progress.totalQuests) return 0;
    return Math.round((progress.completedQuests / progress.totalQuests) * 100);
  }, [progress]);

  if (error) {
    return (
      <MainLayout>
        <div className="py-10 text-center text-accentRose">{error}</div>
      </MainLayout>
    );
  }

  if (!detail) {
    return (
      <MainLayout>
        <div className="py-10 text-center text-mutedSilver">Loading vault...</div>
      </MainLayout>
    );
  }

  const { vault, quests } = detail;

  return (
    <MainLayout fullWidth>
      <div className="flex flex-wrap items-center gap-3 pb-6">
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-onyx dark:text-softGold">{vault.title}</h1>
          <p className="text-sm text-mutedSilver">{vault.category} · {vault.difficulty}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-mutedSilver">{vault.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-mutedSilver">
            <Badge variant="neutral">{vault.theme || 'Adventure'}</Badge>
            {vault.featured && <Badge variant="accent">Featured</Badge>}
            <Badge variant="ghost">{vault.questCount} quests</Badge>
          </div>
          <div className="mt-6 space-y-3">
            {quests.map((quest) => (
              <Card key={quest.id} className="flex flex-col gap-3 border border-onyx/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-onyx dark:text-softGold">{quest.title}</p>
                    <p className="text-sm text-mutedSilver">{quest.description || quest.questType}</p>
                  </div>
                  <Badge variant="neutral">{quest.difficulty || 'Unrated'}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-mutedSilver">
                  <span>{quest.estimatedTime || '15m'}</span>
                  <span>{quest.xpValue} XP</span>
                </div>
                <Button variant="accent" as={Link} to={`/quests/${quest.id}`}>
                  Start quest
                </Button>
              </Card>
            ))}
            {quests.length === 0 && <p className="text-sm text-mutedSilver">No quests in this vault yet.</p>}
          </div>
        </Card>

        <Card title="Your progress">
          <ProgressBar value={completion} />
          <p className="mt-2 text-sm text-mutedSilver">
            {progress ? `${progress.completedQuests} of ${progress.totalQuests} quests` : 'No progress recorded yet.'}
          </p>
          <div className="mt-4 space-y-2 text-sm text-mutedSilver">
            <p>Mascot: {vault.mascotName || 'N/A'}</p>
            <p>Theme: {vault.theme || 'Adventure'}</p>
            <p>Status: {vault.status}</p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
