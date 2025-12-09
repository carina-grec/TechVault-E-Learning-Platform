import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ListOfVaults() {
  const { token, user, profile, logout } = useAuth();
  const [vaults, setVaults] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  if (loading && !vaults.length) return <div className="flex h-screen items-center justify-center bg-[#F1F5F9] font-display text-slate-900">Loading vaults...</div>;

  return (
    <MainLayout>
      <div className="flex w-full flex-col">
        {/* PageHeading */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8">
          <div className="flex flex-col gap-2">
            <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Vaults</p>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">Select a vault to start or continue your learning journey.</p>
          </div>
        </div>

        {/* SearchBar */}
        <div className="pb-8">
          <form onSubmit={handleSearch} className="flex h-12 w-full max-w-lg flex-col">
            <div className="flex w-full flex-1 items-stretch rounded-lg border-2 border-slate-900 bg-white dark:bg-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-slate-600 dark:text-slate-400 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400 h-full px-2 text-base font-normal leading-normal"
                placeholder="Search vaults by name or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* ImageGrid adapted to Neo-Brutalism */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vaults.map((vault) => (
            <div key={vault.id} className="flex flex-col gap-4 rounded-lg border-2 border-slate-900 bg-white dark:bg-slate-800 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="relative">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg border-2 border-slate-900 bg-slate-200"
                  style={{ backgroundImage: `url('https://placehold.co/600x400/bef264/000?text=${encodeURIComponent(vault.title)}')` }}
                ></div>
                <div className={`absolute top-2 right-2 rounded border-2 border-slate-900 px-2 py-0.5 text-xs font-bold text-slate-900 ${vault.featured ? 'bg-[#3df5a7]' : 'bg-white'}`}>
                  {vault.featured ? 'Featured' : vault.status || 'Unlocked'}
                </div>
              </div>
              <div className="flex flex-grow flex-col gap-4">
                <div className="flex flex-col">
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-normal">{vault.title}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal line-clamp-2">{vault.description}</p>
                </div>
                <Link
                  to={`/vaults/${vault.id}`}
                  className="mt-auto flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-slate-900 bg-[#bef264] text-slate-900 h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                  Open Vault
                </Link>
              </div>
            </div>
          ))}
          {vaults.length === 0 && !loading && (
            <p className="text-slate-600 dark:text-slate-400">No vaults found.</p>
          )}
        </div>

        {/* Pagination (Static for now) */}
        <div className="flex items-center justify-center pt-12">
          <button disabled className="flex size-10 items-center justify-center rounded-lg border-2 border-slate-900 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50">
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button className="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white dark:text-slate-900 rounded-lg bg-slate-900 dark:bg-white mx-2">1</button>
          <button disabled className="flex size-10 items-center justify-center rounded-lg border-2 border-slate-900 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ml-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
