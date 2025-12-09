import React, { useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Button } from './Button.jsx';
import { cn } from '../lib/cn.js';
import { useAuth } from '../context/AuthContext.jsx';

const roleLinks = {
    LEARNER: [
        { label: 'Vaults', to: '/vaults' },
        // Removed Dashboard and Settings as requested
    ],
    GUARDIAN: [
        { label: 'Guardian', to: '/guardian' },
    ],
    ADMIN: [
        { label: 'Content', to: '/admin/cms' },
        { label: 'Users', to: '/admin/users' },
    ],
};

export function Sidebar({ className }) {
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

    if (!isAuthenticated) return null;

    return (
        <aside className={cn("fixed left-0 top-0 h-screen w-64 flex-col border-r-2 border-onyx bg-white dark:bg-charcoal dark:border-mutedSilver hidden lg:flex", className)}>
            {/* Header / Logo */}
            <div className="flex items-center gap-3 p-6 border-b-2 border-slate-900 dark:border-mutedSilver/20">
                <div className="flex size-10 items-center justify-center rounded-lg border border-onyx/10 bg-lime-300 text-charcoal font-bold shadow-depth dark:border-mutedSilver/40 dark:bg-lime-400 dark:text-charcoal">
                    TV
                </div>
                <div>
                    <p className="font-display text-lg font-bold text-onyx dark:text-softGold tracking-tight uppercase">TechVault</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold transition-all',
                                'text-slate-500 hover:bg-slate-100 dark:text-mutedSilver dark:hover:bg-onyx',
                                isActive && 'bg-lime-300 text-slate-900 shadow-[4px_4px_0px_#000] translate-x-[-2px] translate-y-[-2px] dark:bg-lime-400 dark:text-slate-900'
                            )
                        }
                    >
                        {/* Optional Icons could go here if mapped */}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t-2 border-slate-900 dark:border-mutedSilver/20 bg-slate-50/50 dark:bg-onyx/30">
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="size-10 rounded-full border border-onyx bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url("https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.username || user?.username || 'user'}")` }}
                    ></div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-onyx dark:text-white truncate">
                            {profile?.displayName || user?.displayName || 'User'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user?.role}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
