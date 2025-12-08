import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button.jsx';
import Badge from '../Badge.jsx';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Editor from '@monaco-editor/react';
import VictoryModal from '../../pages/VictoryModal.jsx';
import DefeatModal from '../../pages/DefeatModal.jsx';

export default function CodeChallenge({ quest }) {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState(quest.starterCode || '');
    const [status, setStatus] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tab, setTab] = useState('instructions');
    const [showVictory, setShowVictory] = useState(false);
    const [showDefeat, setShowDefeat] = useState(false);

    // Poll for results
    useEffect(() => {
        if (!submission || !token) return;
        if (!['PENDING', 'GRADING'].includes(submission.status)) return;

        const timer = setInterval(async () => {
            try {
                const refreshed = await api.getSubmission(token, submission.submissionId);
                setSubmission(refreshed);
            } catch (err) {
                setStatus(err.message);
            }
        }, 2000);

        return () => clearInterval(timer);
    }, [submission, token]);

    // Handle Victory/Defeat Trigger
    useEffect(() => {
        if (!submission) return;

        const isSuccess = submission.isSuccess || submission.success;

        if (submission.status === 'ACCEPTED' || (submission.status === 'COMPLETED' && isSuccess)) {
            setStatus('Grading Complete: Quest Accepted!');
            // Delay slightly to show status then modal
            const timer = setTimeout(() => setShowVictory(true), 1000);
            return () => clearTimeout(timer);
        } else if (submission.status === 'REJECTED' || submission.status === 'ERROR' || (submission.status === 'COMPLETED' && !isSuccess)) {
            setStatus('Grading Complete: Check your output.');
            const timer = setTimeout(() => setShowDefeat(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [submission]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setStatus(null);
        setShowVictory(false);
        setShowDefeat(false);
        try {
            const payload = {
                questId: quest.id,
                source: code,
                language: quest.language || 'javascript',
            };
            const res = await api.submitQuest(token, payload);
            setSubmission(res);
            setStatus('Submission sent. Grading in progress...');
        } catch (err) {
            setStatus(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        navigate('/vaults'); // Should ideally go to next quest, but vault list is safe default
    };

    const handleRetry = () => {
        setShowDefeat(false);
        setStatus(null);
    };

    return (
        <div className="relative flex h-[calc(100vh-64px)] w-full flex-col bg-[#F0F0F0] font-display">
            {/* Modals */}
            <VictoryModal
                isOpen={showVictory}
                onClose={() => setShowVictory(false)}
                onNext={handleNext}
                xp={quest.xpValue}
            />
            <DefeatModal
                isOpen={showDefeat}
                onClose={() => setShowDefeat(false)}
                onRetry={handleRetry}
                errors={submission?.stderr || 'Test cases failed or no output provided.'}
            />

            <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-2 lg:gap-8 lg:p-8">

                {/* Left Panel: Instructions */}
                <div className="flex flex-col overflow-hidden rounded-xl border-4 border-black bg-white shadow-[4px_4px_0px_#000]">
                    <div className="border-b-4 border-black p-4">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-2xl font-bold text-black">{quest.title}</h2>
                            <span className="rounded-md border-2 border-black bg-yellow-400 px-3 py-1 text-sm font-bold text-black uppercase">{quest.difficulty || 'Easy'}</span>
                        </div>
                    </div>
                    {/* Tabs */}
                    <div className="flex border-b-4 border-black">
                        <button
                            onClick={() => setTab('instructions')}
                            className={`flex-1 border-r-4 border-black py-3 text-base font-bold text-black ${tab === 'instructions' ? 'bg-[#7937eb]/20' : 'hover:bg-[#7937eb]/10'}`}
                        >
                            Instructions
                        </button>
                        <button
                            onClick={() => setTab('testcases')}
                            className={`flex-1 py-3 text-base font-bold text-black ${tab === 'testcases' ? 'bg-[#7937eb]/20' : 'hover:bg-[#7937eb]/10'}`}
                        >
                            Test Cases
                        </button>
                    </div>
                    {/* Content */}
                    <div className="flex-1 space-y-6 overflow-y-auto p-6">
                        {tab === 'instructions' ? (
                            <div className="prose prose-sm max-w-none text-black">
                                <h3 className="text-xl font-bold text-black">Problem Description</h3>
                                <div className="mt-2 text-base text-gray-700 whitespace-pre-wrap">{quest.description}</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-black">Test Cases</h3>
                                {(quest.testCases || []).map((tc, idx) => (
                                    <div key={idx} className="rounded-lg border-2 border-black bg-gray-100 p-4">
                                        <p className="font-mono text-sm font-semibold">Case {idx + 1} {tc.hidden ? '(Hidden)' : ''}</p>
                                        {!tc.hidden && (
                                            <div className="mt-1 font-mono text-sm text-gray-800">
                                                <p><span className="font-bold">Input:</span> {tc.input}</p>
                                                <p><span className="font-bold">Output:</span> {tc.expectedOutput}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: IDE */}
                <div className="flex flex-col gap-4 overflow-hidden lg:gap-8">
                    {/* Code Editor */}
                    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border-4 border-black bg-slate-900 shadow-[4px_4px_0px_#000]">
                        <div className="flex items-center justify-between border-b-4 border-black p-2 bg-slate-900">
                            <div className="flex items-center px-2">
                                <span className="flex size-4 items-center justify-center rounded-full bg-red-500"></span>
                                <span className="ml-2 flex size-4 items-center justify-center rounded-full bg-yellow-500"></span>
                                <span className="ml-2 flex size-4 items-center justify-center rounded-full bg-green-500"></span>
                            </div>
                            <div className="relative">
                                <div className="w-40 rounded-md border-2 border-black bg-white px-3 py-1.5 text-sm font-bold text-black text-center uppercase">
                                    {quest.language || 'JavaScript'}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden pt-2">
                            <Editor
                                height="100%"
                                defaultLanguage={quest.language?.toLowerCase() || 'javascript'}
                                value={code}
                                onChange={(value) => setCode(value)}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    padding: { top: 16 }
                                }}
                            />
                        </div>
                    </div>

                    {/* Console and Actions */}
                    <div className="flex h-48 min-h-[12rem] flex-col rounded-xl border-4 border-black bg-slate-900 shadow-[4px_4px_0px_#000]">
                        <div className="border-b-4 border-black px-4 py-2">
                            <h4 className="text-base font-bold text-white">Console</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                            {status && <p className="text-yellow-400">{status}</p>}
                            {submission?.stdout && <pre className="text-gray-300">{submission.stdout}</pre>}
                            {submission?.stderr && <pre className="text-red-400">{submission.stderr}</pre>}
                            {!status && !submission && <p className="text-gray-500">Run code to see output...</p>}
                        </div>
                        <div className="flex items-center justify-end gap-4 p-3">
                            <button
                                onClick={handleSubmit}
                                className="flex h-11 cursor-pointer items-center justify-center rounded-lg border-2 border-black bg-lime-400 px-8 text-base font-bold text-black transition-all shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Running...' : 'Run & Submit'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
