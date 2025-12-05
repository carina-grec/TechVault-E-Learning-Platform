import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Button } from './Button.jsx';
import { cn } from '../lib/cn.js';
import { useAuth } from '../context/AuthContext.jsx';

const roleLinks = {
  LEARNER: [
    { label: 'Dashboard', to: '/' },
    { label: 'Vaults', to: '/vaults' },
    { label: 'Dojo', to: '/quests' },
  ],
  GUARDIAN: [
    { label: 'Guardian', to: '/guardian' },
    { label: 'Assignments', to: '/assignments' },
  ],
  ADMIN: [
    { label: 'Content', to: '/admin/cms' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'Users', to: '/admin/users' },
  ],
};

export function Navbar({ className }) {
  const navigate = useNavigate();
  const { user, profile, logout, isAuthenticated } = useAuth();
  const links = useMemo(() => {
    if (!user) return [];
    return roleLinks[user.role] || [];
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={cn('w-full border-b border-onyx/10 bg-ivory/80 backdrop-blur dark:border-mutedSilver/20 dark:bg-charcoal/80', className)}>
      <div className="soft-container flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-onyx/10 bg-softGold text-charcoal font-bold shadow-depth dark:border-mutedSilver/40 dark:bg-deepViolet dark:text-softGold">
            TV
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-onyx dark:text-softGold">TechVault</p>
            <p className="text-xs text-mutedSilver">Boho x Emo minimal</p>
          </div>
        </div>
        <nav className="hidden items-center gap-3 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-semibold text-onyx dark:text-mutedSilver hover:bg-sand/50 dark:hover:bg-onyx',
                  isActive && 'bg-sand text-charcoal shadow-depth dark:bg-deepViolet/60 dark:text-softGold',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isAuthenticated && (
            <Button as={NavLink} to="/login" variant="accent" size="sm" className="hidden sm:inline-flex">
              Login
            </Button>
          )}
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs text-mutedSilver leading-none">Signed in</span>
                <span className="text-sm font-semibold text-onyx dark:text-softGold">
                  {profile?.displayName || user?.displayName || user?.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
                Settings
              </Button>
              <Button variant="accent" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
