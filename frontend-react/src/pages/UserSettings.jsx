import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserSettings() {
  const { profile, logout } = useAuth();

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: profile?.displayName || 'Alex Doe',
    username: profile?.username || 'alex_doe',
    language: 'English',
    theme: 'System',
    highContrast: false,
    reducedMotion: true,
    notifications: {
      courseUpdates: true,
      weeklyProgress: true,
      mentions: false
    }
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Neo-Brutalist Toggle Switch
  const Toggle = ({ checked, onChange, label }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-slate-900 transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-lime-400' : 'bg-white'}`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-border-light shadow ring-0 transition duration-200 ease-in-out border-2 border-slate-900 mt-[2px] ${checked ? 'translate-x-7 bg-white' : 'translate-x-1 bg-slate-200'}`}
      />
    </button>
  );

  return (
    <MainLayout fullWidth={true}>
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8 min-h-screen font-display">
        <div className="mx-auto max-w-4xl space-y-12">

          {/* Page Heading */}
          <h1 className="text-5xl font-bold tracking-tighter text-slate-900 dark:text-slate-200">Settings</h1>

          {/* Profile Section */}
          <section className="space-y-6 rounded-xl border-2 border-slate-900 dark:border-slate-200 bg-white dark:bg-slate-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-200">Profile Information</h2>

            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <div
                  className="size-32 rounded-full border-2 border-slate-900 dark:border-slate-200 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url("https://api.dicebear.com/7.x/notionists/svg?seed=${formData.username}")` }}
                ></div>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-2xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-200">{formData.fullName}</p>
                <p className="text-base font-normal leading-normal text-slate-500 dark:text-slate-400">{profile?.email || 'user@example.com'}</p>
              </div>
              <button className="h-12 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-slate-900 dark:border-slate-200 bg-white dark:bg-slate-700 px-6 text-sm font-bold tracking-wide text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:w-auto transition-all">
                Upload new picture
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <p className="text-base font-medium leading-normal text-slate-900 dark:text-slate-200">Full Name</p>
                <input
                  className="form-input h-14 w-full rounded-lg border-2 border-slate-900 dark:border-slate-200 bg-slate-50 dark:bg-slate-900 p-4 text-base font-normal text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-400 focus:outline-none"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <p className="text-base font-medium leading-normal text-slate-900 dark:text-slate-200">Username</p>
                <input
                  className="form-input h-14 w-full rounded-lg border-2 border-slate-900 dark:border-slate-200 bg-slate-50 dark:bg-slate-900 p-4 text-base font-normal text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-400 focus:outline-none"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                />
              </label>
            </div>
            <div>
              <a className="font-bold text-blue-600 hover:underline" href="#">Change Password</a>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="space-y-6 rounded-xl border-2 border-slate-900 dark:border-slate-200 bg-white dark:bg-slate-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-200">Preferences</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <p className="text-base font-medium leading-normal text-slate-900 dark:text-slate-200">Language</p>
                <select
                  className="form-select h-14 w-full rounded-lg border-2 border-slate-900 dark:border-slate-200 bg-slate-50 dark:bg-slate-900 p-4 text-base font-normal text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-400 focus:outline-none"
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <p className="text-base font-medium leading-normal text-slate-900 dark:text-slate-200">Theme</p>
                <select
                  className="form-select h-14 w-full rounded-lg border-2 border-slate-900 dark:border-slate-200 bg-slate-50 dark:bg-slate-900 p-4 text-base font-normal text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-400 focus:outline-none"
                  value={formData.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                >
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-200">High Contrast Mode</p>
                  <p className="text-sm text-slate-500">Increases text and element contrast.</p>
                </div>
                <Toggle
                  checked={formData.highContrast}
                  onChange={() => handleChange('highContrast', !formData.highContrast)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-200">Reduced Motion</p>
                  <p className="text-sm text-slate-500">Disables decorative animations and effects.</p>
                </div>
                <Toggle
                  checked={formData.reducedMotion}
                  onChange={() => handleChange('reducedMotion', !formData.reducedMotion)}
                />
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="space-y-4 rounded-xl border-2 border-slate-900 dark:border-slate-200 bg-white dark:bg-slate-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-200">Notifications</h2>

            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900 dark:text-slate-200">Course Updates</p>
              <Toggle
                checked={formData.notifications.courseUpdates}
                onChange={() => handleNotificationChange('courseUpdates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900 dark:text-slate-200">Weekly Progress Reports</p>
              <Toggle
                checked={formData.notifications.weeklyProgress}
                onChange={() => handleNotificationChange('weeklyProgress')}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="font-medium text-slate-900 dark:text-slate-200">Community Mentions</p>
              <Toggle
                checked={formData.notifications.mentions}
                onChange={() => handleNotificationChange('mentions')}
              />
            </div>
          </section>

          {/* Account Actions Section */}
          <section className="space-y-6 rounded-xl border-2 border-slate-900 dark:border-slate-200 bg-white dark:bg-slate-800 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-slate-200">Account Actions</h2>

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-200">Logout</p>
                <p className="text-sm text-slate-500">You will be returned to the login screen.</p>
              </div>
              <button
                onClick={handleLogout}
                className="h-12 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-slate-900 dark:border-slate-200 bg-white dark:bg-slate-700 px-6 text-sm font-bold tracking-wide text-slate-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:w-auto transition-all"
              >
                Logout
              </button>
            </div>

            <div className="flex flex-col items-start gap-4 rounded-lg border-2 border-red-500 p-4 sm:flex-row sm:items-center sm:justify-between bg-red-50 dark:bg-red-900/10">
              <div>
                <p className="font-bold text-red-600">Delete Account</p>
                <p className="text-sm text-slate-500">Permanently delete your account and all data.</p>
              </div>
              <button className="h-12 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-red-500 bg-red-100 px-6 text-sm font-bold tracking-wide text-red-600 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] sm:w-auto transition-all">
                Delete Account
              </button>
            </div>
          </section>

          {/* Footer Save */}
          <div className="sticky bottom-0 mt-12 py-4 border-t-2 border-slate-200 dark:border-slate-800">
            <div className="mx-auto flex max-w-4xl justify-end">
              <button className="flex h-14 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-slate-900 bg-lime-400 px-8 text-lg font-bold tracking-wide text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none sm:w-auto transition-all">
                Save Changes
              </button>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
