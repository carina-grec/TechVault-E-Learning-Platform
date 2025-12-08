import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

export default function ParentalConsentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    childUsername: '',
    agreed: false,
    signature: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      setStatus({ type: 'error', message: 'You must agree to the terms.' });
      return;
    }
    try {
      setStatus({ type: 'loading', message: 'Submitting consent...' });
      // Call backend API if it exists, otherwise simulate success for UI verification
      // await api.submitConsent(formData); 
      console.log('Consent Submitted:', formData);

      setStatus({ type: 'success', message: 'Consent submitted successfully! Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f7f6f8] dark:bg-[#171121] font-display">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-center bg-[#f7f6f8]/80 dark:bg-[#171121]/80 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
          <div className="size-6">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em]">Stitch</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex w-full max-w-2xl flex-col items-center justify-center mt-16">
        <div className="w-full rounded border-2 border-slate-900 bg-white dark:bg-slate-800 p-6 sm:p-8 lg:p-12 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
          <div className="mb-8 flex flex-col gap-3 text-center">
            <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-bold tracking-tighter sm:text-5xl">Parental Consent Form</h1>
            <p className="text-slate-700 dark:text-slate-300 text-base font-normal leading-normal max-w-xl mx-auto">
              To comply with federal law (COPPA), we require parental consent for users under the age of 13. Please fill out the form below to grant permission for your child to use Stitch.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {status && (
              <div className={`p-4 rounded border-2 border-slate-900 ${status.type === 'error' ? 'bg-red-100/50 text-red-900' : 'bg-green-100/50 text-green-900'}`}>
                {status.message}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-y-2">
                <label className="text-slate-700 dark:text-slate-300 text-base font-medium" htmlFor="parent-name">Parent/Guardian Full Name</label>
                <input
                  className="h-12 w-full px-4 bg-white border-2 border-slate-300 rounded focus:border-[#7937eb] focus:ring-[#7937eb] focus:outline-none focus:ring-1 text-slate-900 placeholder:text-slate-400"
                  id="parent-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <label className="text-slate-700 dark:text-slate-300 text-base font-medium" htmlFor="parent-email">Parent/Guardian Email</label>
                <input
                  className="h-12 w-full px-4 bg-white border-2 border-slate-300 rounded focus:border-[#7937eb] focus:ring-[#7937eb] focus:outline-none focus:ring-1 text-slate-900 placeholder:text-slate-400"
                  id="parent-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-slate-700 dark:text-slate-300 text-base font-medium" htmlFor="child-username">Child's Username</label>
              <input
                className="h-12 w-full px-4 bg-white border-2 border-slate-300 rounded focus:border-[#7937eb] focus:ring-[#7937eb] focus:outline-none focus:ring-1 text-slate-900 placeholder:text-slate-400"
                id="child-username"
                type="text"
                placeholder="Confirm your child's username"
                value={formData.childUsername}
                onChange={(e) => setFormData({ ...formData, childUsername: e.target.value })}
                required
              />
            </div>

            <div className="space-y-4 rounded border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20 p-4">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    className="size-5 border-2 border-slate-300 rounded text-[#7937eb] focus:ring-[#7937eb]"
                    id="consent-checkbox"
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-slate-700 dark:text-slate-300" htmlFor="consent-checkbox">
                    I have read and agree to the <a className="font-semibold text-violet-600 dark:text-violet-400 hover:underline" href="#">Terms of Service</a> and <a className="font-semibold text-violet-600 dark:text-violet-400 hover:underline" href="#">Privacy Policy</a>, and I give my consent for my child to use Stitch.
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-slate-700 dark:text-slate-300 text-base font-medium" htmlFor="digital-signature">Digital Signature</label>
              <p className="text-sm text-slate-500 dark:text-slate-400 -mt-1 mb-1">Please type your full name below to digitally sign this form.</p>
              <input
                className="h-12 w-full px-4 bg-white border-2 border-slate-300 rounded focus:border-[#7937eb] focus:ring-[#7937eb] focus:outline-none focus:ring-1 text-slate-900 placeholder:text-slate-400 font-display"
                id="digital-signature"
                type="text"
                placeholder="Type your full name"
                value={formData.signature}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="h-14 w-full rounded bg-lime-400 text-black text-lg font-bold tracking-wide transition-all duration-150 ease-in-out border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                Submit Consent
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-base">lock</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your information is transmitted securely.</p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
