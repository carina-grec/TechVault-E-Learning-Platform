import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function QuestList() {
  const { token } = useAuth();
  const [quests, setQuests] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuests();
  }, [token]);

  const fetchQuests = async () => {
    setLoading(true);
    try {
      const params = difficulty ? { difficulty } : {};
      const res = await api.getQuests(params, token);
      setQuests(res || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchQuests();
  };

  return (
    <MainLayout>
      <Section
        title="Quest Library"
        description="Pick a quest to earn XP and unlock badges."
      />
      <form className="mb-4 flex flex-wrap items-end gap-3" onSubmit={handleFilter}>
        <Input id="difficulty" label="Difficulty" placeholder="Beginner / Intermediate / Advanced" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
        <Button type="submit" variant="secondary">Filter</Button>
      </form>
      {loading && <p className="text-mutedSilver">Loading quests...</p>}
      {error && <p className="text-accentRose">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quests.map((quest) => (
          <Card key={quest.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-onyx dark:text-softGold">{quest.title}</p>
              <Badge variant="neutral">{quest.difficulty || 'Unrated'}</Badge>
            </div>
            <p className="text-sm text-mutedSilver">{quest.description || 'Code challenge'}</p>
            <div className="flex items-center justify-between text-xs text-mutedSilver">
              <span>{quest.questType}</span>
              <span>{quest.xpValue} XP</span>
            </div>
            <Button variant="accent" as={Link} to={`/quests/${quest.id}`}>
              Open quest
            </Button>
          </Card>
        ))}
      </div>
      {!loading && quests.length === 0 && <p className="mt-4 text-sm text-mutedSilver">No quests available.</p>}
    </MainLayout>
  );
}
