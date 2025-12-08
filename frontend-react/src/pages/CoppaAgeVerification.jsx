import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';

export default function CoppaAgeVerification() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [parentEmail, setParentEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    if (!parentEmail) {
      setError('Please enter a parent email address.');
      return;
    }

    try {
      await api.initiateConsent(token, parentEmail);
      setStatus('Consent request sent! Please ask your parent to check their email.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send consent request.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user && !token) {
    // Ideally redirect to login, but for dev flow let's show link
    return (
      <div className="flex h-screen items-center justify-center">
        <button onClick={() => navigate('/login')} className="underline">Please Log In</button>
      </div>
    )
  }

  return (
    <MainLayout hideChrome>
      <div
        className="relative flex min-h-screen w-full flex-col items-center justify-center bg-indigo-50 dark:bg-charcoal p-4 sm:p-6 font-display"
        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCFlNcIdTdxLvhMnhDcZK1qcpqoLwNJY01uTip-rxaWTNF7DMEHOS9KrO184vf1l00nn_pF58Zqfmb3OtoZHV7BQGSesLGSYTN_JhdtNdqEVrYALfq8Ipz6YAt2T4GcHW_aHMkTNGkgTo0P8JrFaSnlt3pjvA8bxQe7Vgz1u-mu_XNiW-tMvXuzc4vVoj6Dph2mSuPox4uzEZKwim5hVYBytxMh8mJRbnVy_0J6Zre0hML-4OA6l4gEUv-tb2Gnd7WDpnbSQ1i6hpw')` }}
      >
        <div className="w-full max-w-md bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_#000000] p-6 sm:p-8 space-y-6">
          <h1 className="text-black font-bold text-3xl font-display leading-tight">Looks like you need a hand!</h1>
          <p className="text-black text-base font-normal leading-normal font-display">
            To make sure your coding journey is safe and fun, users under 13 need a parent's permission to join Stitch.
            No problem, just ask them for a little help!
          </p>

          {!status ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <label className="flex flex-col">
                <p className="text-black text-base font-medium leading-normal pb-2 font-display">Enter parent's email</p>
                <input
                  type="email"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-none text-black focus:outline-none focus:ring-4 focus:ring-lime-400 focus:ring-offset-0 border-4 border-black bg-white h-14 placeholder:text-gray-500 p-3 text-base font-normal leading-normal font-display"
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-none border-4 border-black bg-violet-600 text-white h-14 px-5 text-lg font-bold leading-normal tracking-wide shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#000000] transition-shadow duration-200"
              >
                <span className="truncate">Ask a Parent for Help</span>
              </button>
            </form>
          ) : (
            <div className="mt-6 border-4 border-black bg-emerald-100 p-4 font-display text-emerald-900 shadow-[4px_4px_0px_0px_#000000]">
              <p className="font-bold">Success!</p>
              <p>{status}</p>
            </div>
          )}

          {error && (
            <div className="mt-2 text-sm font-bold text-red-600 font-display">
              {error}
            </div>
          )}

          <div className="pt-2 text-center">
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-black hover:underline font-display">
              Log out
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
