import React, { useMemo } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Button } from './Button.jsx';
import { cn } from '../lib/cn.js';
import { useAuth } from '../context/AuthContext.jsx';

const roleLinks = {
  LEARNER: [
    { label: 'Vaults', to: '/vaults' },
  ],
  GUARDIAN: [
    { label: 'Guardian', to: '/guardian' },
  ],
  ADMIN: [
    { label: 'Content', to: '/admin/cms' },
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
    <header className={cn('w-full border-b-2 border-onyx bg-white py-4 shadow-hard dark:bg-charcoal dark:border-mutedSilver', className)}>
      <div className="soft-container flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-onyx/10 bg-softGold text-charcoal font-bold shadow-depth dark:border-mutedSilver/40 dark:bg-deepViolet dark:text-softGold">
            TV
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-onyx dark:text-softGold">TechVault</p>
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
              <div className="flex items-center gap-3">
                <div
                  className="size-9 rounded-full border border-onyx bg-cover bg-center"
                  style={{ backgroundImage: `url("https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.username || user?.username || 'user'}")` }}
                ></div>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs text-mutedSilver leading-none">Signed in</span>
                  <span className="text-sm font-semibold text-onyx dark:text-softGold">
                    {profile?.displayName || user?.displayName || user?.email}
                  </span>
                </div>
              </div>
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
