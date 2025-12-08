import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AssignmentControls() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]);
  const [activeLearner, setActiveLearner] = useState(null);
  const [vaults, setVaults] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!token) return;
    api.getGuardianLearners(token).then((res) => {
      setLearners(res || []);
      setActiveLearner(res?.[0] || null);
    });
    api.getVaults({}, token).then((res) => setVaults(res || []));
  }, [token]);

  const filteredVaults = vaults.filter(v => v.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <MainLayout fullWidth>
      <Section
        title="Assignment controls"
        description="Select a learner and view available vaults."
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-4">
          <p className="text-sm font-semibold text-onyx dark:text-softGold">Select a learner</p>
          <div className="space-y-3">
            {learners.map((child) => (
              <Card
                key={child.id}
                className={`cursor-pointer border ${activeLearner?.id === child.id ? 'border-deepViolet' : 'border-transparent'}`}
                onClick={() => setActiveLearner(child)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-onyx dark:text-softGold">{child.displayName || child.username}</p>
                    <p className="text-sm text-mutedSilver">Level {child.level}</p>
                  </div>
                  <ProgressBar value={child.currentStreak ? Math.min(100, child.currentStreak * 5) : 0} className="w-28" />
                </div>
              </Card>
            ))}
            {learners.length === 0 && <p className="text-sm text-mutedSilver">No linked learners.</p>}
          </div>
        </aside>

        <section className="space-y-4">
          <Card className="flex items-center justify-between gap-4">
            <p className="font-semibold text-onyx dark:text-softGold whitespace-nowrap">Vaults for {activeLearner?.displayName || '...'}</p>
            <input
              className="w-full max-w-xs rounded-md border border-onyx/20 px-3 py-1.5 text-sm"
              placeholder="Filter vaults..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </Card>
          <div className="space-y-3">
            {filteredVaults.map((item) => (
              <Card key={item.id} className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-sand text-onyx">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      inventory_2
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-onyx dark:text-softGold">{item.title}</p>
                    <p className="text-sm text-mutedSilver">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="success" onClick={() => navigate(`/vaults/${item.id}`)}>
                    View quests
                  </Button>
                </div>
              </Card>
            ))}
            {filteredVaults.length === 0 && <p className="text-center text-mutedSilver py-4">No vaults found.</p>}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
