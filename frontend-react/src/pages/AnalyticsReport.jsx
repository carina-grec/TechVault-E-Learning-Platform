import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AnalyticsReport() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState({
    totalXP: '12,840',
    topicsMastered: 8,
    timeSpent: '42h 15m'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    // Switch to Learner Metrics
    // api.getLearnerMetrics(token).then(setMetrics).catch(console.error);

    // Mocking for now as we don't have the backend endpoint ready
    setLoading(true);
    setTimeout(() => {
      setMetrics({
        totalXP: '1,250',
        topicsMastered: 3,
        timeSpent: '12h 30m'
      });
      setLoading(false);
    }, 500);
  }, [token]);

  return (
    <MainLayout fullWidth={true}>
      <div className="min-h-screen p-6 lg:p-10 font-display">
        <div className="mx-auto max-w-7xl">
          {/* Page Heading & Chips */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight">My Progress</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Track your mastery journey.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white px-4 shadow-[4px_4px_0px_#000] text-sm font-bold leading-normal hover:bg-slate-100 dark:hover:bg-slate-700 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                <span>Last 7 Days</span>
                <span className="material-symbols-outlined text-xl">expand_more</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-lime-400 text-slate-900 text-sm font-bold leading-normal border-2 border-slate-900 shadow-[4px_4px_0px_#000] hover:bg-lime-300 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                <span className="truncate">Print Report</span>
              </button>
            </div>
          </header>

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col gap-2 rounded-lg p-6 border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-800 shadow-[4px_4px_0px_#000]">
              <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">Total XP</p>
              <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight">{metrics.totalXP}</p>
              <p className="text-green-600 dark:text-green-400 text-base font-bold leading-normal">+12%</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-6 border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-800 shadow-[4px_4px_0px_#000]">
              <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">Topics Mastered</p>
              <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight">{metrics.topicsMastered}</p>
              <p className="text-green-600 dark:text-green-400 text-base font-bold leading-normal">+2 This week</p>
            </div>
            <div className="flex flex-col gap-2 rounded-lg p-6 border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-800 shadow-[4px_4px_0px_#000]">
              <p className="text-slate-900 dark:text-white text-base font-bold leading-normal">Time Spent</p>
              <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight">{metrics.timeSpent}</p>
              <p className="text-green-600 dark:text-green-400 text-base font-bold leading-normal">+8%</p>
            </div>
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Chart 1: XP Over Time */}
            <div className="flex flex-col gap-4 rounded-lg border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-800 p-6 shadow-[4px_4px_0px_#000]">
              <div className="flex flex-col">
                <p className="text-slate-900 dark:text-white text-xl font-bold leading-normal">XP Over Time</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Last 30 Days</p>
              </div>
              <div className="flex min-h-[250px] flex-1 flex-col justify-end overflow-hidden">
                {/* Placeholder SVG Chart - In a real app use Recharts/Chart.js */}
                <svg fill="none" preserveAspectRatio="none" viewBox="0 0 475 150" width="100%" className="max-h-[150px]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 109C18.2692 109 18.2692 21 36.5385 21C54.8077 21 54.8077 41 73.0769 41C91.3462 41 91.3462 93 109.615 93C127.885 93 127.885 33 146.154 33C164.423 33 164.423 101 182.692 101C200.962 101 200.962 61 219.231 61C237.5 61 237.5 45 255.769 45C274.038 45 274.038 121 292.308 121C310.577 121 310.577 149 328.846 149C347.115 149 347.115 1 365.385 1C383.654 1 383.654 81 401.923 81C420.192 81 420.192 129 438.462 129C456.731 129 456.731 25 475 25" stroke="#a3e635" strokeLinecap="round" strokeWidth="4"></path>
                </svg>
              </div>
              <div className="flex justify-between border-t border-slate-900/20 dark:border-white/20 pt-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Week 1</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Week 2</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Week 3</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Week 4</p>
              </div>
            </div>

            {/* Chart 2: Mastery Per Topic */}
            <div className="flex flex-col gap-4 rounded-lg border-2 border-slate-900 dark:border-white bg-white dark:bg-slate-800 p-6 shadow-[4px_4px_0px_#000]">
              <div>
                <p className="text-slate-900 dark:text-white text-xl font-bold leading-normal">Mastery Per Topic</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">All Time Average</p>
              </div>
              <div className="grid grid-cols-1 gap-4 items-end justify-items-center flex-1">
                {[
                  { label: 'Variables', width: '85%', color: 'bg-violet-600' },
                  { label: 'Loops', width: '70%', color: 'bg-lime-400' },
                  { label: 'Functions', width: '95%', color: 'bg-violet-600' },
                  { label: 'Arrays', width: '60%', color: 'bg-lime-400' },
                  { label: 'Objects', width: '40%', color: 'bg-violet-600' },
                ].map((item, idx) => (
                  <div key={idx} className="w-full flex items-center gap-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-bold w-24 shrink-0">{item.label}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 border-2 border-slate-900 dark:border-white">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: item.width }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </MainLayout>
  );
}
