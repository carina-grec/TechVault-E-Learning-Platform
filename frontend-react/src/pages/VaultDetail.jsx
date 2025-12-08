import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

// Custom CSS for connecting lines
const mapNodeStyle = `
  .map-node:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -50px;
    width: 4px;
    height: 50px;
    background-image: repeating-linear-gradient(0deg, #1E293B, #1E293B 10px, transparent 10px, transparent 20px);
    z-index: 0;
    transform: translateX(-50%);
  }
  .map-node.completed::after {
     background-image: repeating-linear-gradient(0deg, #7937eb, #7937eb 10px, transparent 10px, transparent 20px);
  }
`;

export default function VaultDetail() {
  const { vaultId } = useParams();
  const { token, profile } = useAuth();
  const [detail, setDetail] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!vaultId) return;
    loadVault();
  }, [vaultId, token]);

  const loadVault = async () => {
    setLoading(true);
    try {
      const [vaultRes, vaultProgress] = await Promise.all([
        api.getVaultDetail(vaultId, token),
        api.getLearnerVaultProgress(token),
      ]);
      setDetail(vaultRes);
      const p = (vaultProgress || []).find((v) => v.vaultId === Number(vaultId) || v.vaultId === vaultRes?.vault?.id);
      setProgress(p || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#F1F5F9] font-display text-slate-900">Loading vault...</div>;
  if (error || !detail) return <div className="flex h-screen items-center justify-center bg-[#F1F5F9] font-display text-red-600">Error: {error || 'Vault not found'}</div>;

  const { vault, quests } = detail;
  const completedCount = progress?.completedQuests || 0;

  return (
    <>
      <style>{mapNodeStyle}</style>
      <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-indigo-50">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
              <header className="flex items-center justify-between whitespace-nowrap border-2 border-slate-900 bg-white px-6 py-3 shadow-hard rounded-lg text-slate-900">
                <div className="flex items-center gap-4">
                  <div className="size-6 text-[#7937eb]">
                    <span className="material-symbols-outlined text-3xl">pinch</span>
                  </div>
                  <h1 className="text-xl font-bold leading-tight tracking-[-0.015em]">Stitch</h1>
                </div>
                <div className="flex flex-1 justify-end">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-900"
                    style={{ backgroundImage: `url("https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'User'}")` }}
                  ></div>
                </div>
              </header>

              <main className="flex-1 mt-8">
                <div className="border-2 border-slate-900 bg-white rounded-lg shadow-hard-lg p-6 md:p-10">
                  <div className="text-center mb-12">
                    <h1 className="text-slate-900 text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">{vault.title}</h1>
                    <p className="text-slate-500 mt-2 text-lg">{vault.description}</p>
                  </div>

                  <div className="relative pb-20">
                    <div className="absolute inset-y-0 left-1/2 -ml-0.5 w-1 bg-repeat-y" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10px, #e0e0e0 10px, #e0e0e0 20px)' }}></div>

                    <div className="space-y-20 relative">
                      {/* Zone Label (Static for now) */}
                      <div className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center bg-white border-2 border-slate-900 w-full max-w-sm rounded-lg shadow-hard p-4 relative z-10">
                          <h2 className="text-slate-900 text-2xl font-bold leading-tight tracking-[-0.015em] uppercase">ZONE {vault.category?.toUpperCase() || '01'}</h2>
                        </div>
                      </div>

                      {quests.map((quest, index) => {
                        const isCompleted = index < completedCount;
                        const isLocked = index > completedCount;
                        const isNext = index === completedCount;

                        let statusIcon = 'lock';
                        let statusColor = 'text-slate-400';
                        let cardBg = 'bg-slate-100 opacity-70';
                        let borderColor = 'border-slate-300';

                        if (isCompleted) {
                          statusIcon = 'task_alt';
                          statusColor = 'text-[#52FF00]';
                          cardBg = 'bg-[#7937eb]'; // Primary color
                          borderColor = 'border-slate-900';
                        } else if (isNext) {
                          statusIcon = 'play_circle';
                          statusColor = 'text-[#7937eb]';
                          cardBg = 'bg-white';
                          borderColor = 'border-slate-900';
                        }

                        return (
                          <div key={quest.id} className={`flex flex-col items-center text-center relative map-node ${isCompleted ? 'completed' : ''}`}>
                            <div
                              onClick={() => !isLocked && navigate(`/quests/${quest.id}`)}
                              className={`${cardBg} border-2 ${borderColor} w-full max-w-sm rounded-lg shadow-hard p-6 relative z-10 ${!isLocked ? 'hover:-translate-y-1 hover:-translate-x-1 transition-transform cursor-pointer' : ''}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`bg-white rounded-full p-2 border-2 ${borderColor}`}>
                                  <span className={`material-symbols-outlined ${statusColor}`} style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1, 'wght' 700" }}>{statusIcon}</span>
                                </div>
                                <div className="text-left">
                                  <h3 className={`${isCompleted ? 'text-white' : (isLocked ? 'text-slate-500' : 'text-slate-900')} text-xl font-bold leading-tight`}>{quest.title}</h3>
                                  <p className={`${isCompleted ? 'text-indigo-200' : 'text-slate-400'} text-sm font-normal leading-normal`}>
                                    {isLocked ? 'Locked' : `${quest.xpValue} XP`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
