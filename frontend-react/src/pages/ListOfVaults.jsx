import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f7f6f8] dark:bg-[#171121] font-display overflow-x-hidden">
      <div className="flex h-full min-h-screen">
        {/* SideNavBar */}
        <aside className="flex w-64 flex-col gap-8 border-r-2 border-slate-900 bg-[#f7f6f8] dark:bg-[#171121] p-6 hidden md:flex">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border-2 border-slate-900 bg-[#f5d13d] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined text-slate-900">bolt</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stitch</h1>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-12 border-2 border-slate-900"
                style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")' }}
              ></div>
              <div className="flex flex-col">
                <h2 className="text-slate-900 dark:text-white text-base font-bold leading-normal">{profile?.displayName || 'Learner'}</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal">Level {user?.level || 1} Coder</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <Link className="flex items-center gap-3 px-3 py-2 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/">
                <span className="material-symbols-outlined">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link className="flex items-center gap-3 rounded-lg border-2 border-slate-900 bg-[#7937eb]/20 px-3 py-2 text-slate-900 dark:text-white" to="/vaults">
                <span className="material-symbols-outlined">lock</span>
                <p className="text-sm font-bold leading-normal">Vaults</p>
              </Link>
              <Link className="flex items-center gap-3 px-3 py-2 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors" to="/profile">
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </Link>
            </nav>
          </div>
          <div className="mt-auto">
            {user?.role === 'ADMIN' && (
              <Button as={Link} to="/admin/cms" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-slate-900 bg-[#7937eb] text-white h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                <span className="truncate">New Vault</span>
              </Button>
            )}
            <button onClick={logout} className="mt-4 w-full text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-red-500 text-left">Logout</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col p-8 lg:p-12">
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
                      style={{ backgroundImage: `url('https://placehold.co/600x400/7937eb/FFF?text=${encodeURIComponent(vault.title)}')` }}
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
                      className="mt-auto flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-slate-900 bg-[#7937eb] text-white h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
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

            {/* Pagination (Static for now as API doesn't support pagination details in this view properly) */}
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
        </main>
      </div>
    </div>
  );
}
