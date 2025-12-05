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

export default function ListOfVaults() {
  const { token, user } = useAuth();
  const [vaults, setVaults] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVaults();
  }, [token]);

  const fetchVaults = async () => {
    setLoading(true);
    try {
      const res = await api.getVaults(search ? { search } : {}, token);
      setVaults(res || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVaults();
  };

  return (
    <MainLayout fullWidth>
      <Section
        title="Vaults"
        description="Select a vault to start or continue your learning journey."
        actions={user?.role === 'ADMIN' ? <Button as={Link} to="/admin/cms" variant="accent">New vault</Button> : null}
      />
      <form className="max-w-lg pb-6 flex gap-3" onSubmit={handleSearch}>
        <Input id="vault-search" label="Search" placeholder="Search vaults by name or topic..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button type="submit" variant="secondary" className="self-end">Search</Button>
      </form>
      {loading && <p className="text-mutedSilver">Loading vaults...</p>}
      {error && <p className="text-accentRose">{error}</p>}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vaults.map((vault) => (
          <Card key={vault.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-display font-semibold text-onyx dark:text-softGold">{vault.title}</p>
                <p className="text-sm text-mutedSilver">{vault.description}</p>
              </div>
              <Badge variant={vault.featured ? 'accent' : 'neutral'}>{vault.difficulty || 'Unrated'}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-mutedSilver">
              <span>{vault.questCount} quests</span>
              <span>{vault.status}</span>
            </div>
            <Button variant="accent" as={Link} to={`/vaults/${vault.id}`}>
              Open vault
            </Button>
          </Card>
        ))}
      </div>
      {!loading && vaults.length === 0 && <p className="mt-4 text-sm text-mutedSilver">No vaults found.</p>}
    </MainLayout>
  );
}
