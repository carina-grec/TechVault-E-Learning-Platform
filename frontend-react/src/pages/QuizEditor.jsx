import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function QuizEditor() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        xpValue: 50,
        questions: [
            { text: 'What is 2 + 2?', options: ['3', '4', '5'], correctAnswer: '1' } // Example default
        ]
    });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const [vaults, setVaults] = useState([]);

    useEffect(() => {
        if (token) {
            api.getAdminVaults(token).then(setVaults).catch(console.error);
        }
    }, [token]);

    const handleSave = async () => {
        setStatus({ type: 'loading', message: 'Saving quiz...' });
        try {
            await api.createQuest(token, { ...formData, type: 'QUIZ' });
            setStatus({ type: 'success', message: 'Quiz saved successfully!' });
            setTimeout(() => navigate('/admin/cms'), 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err.message });
        }
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { text: '', options: ['', '', ''], correctAnswer: '0' }]
        }));
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...formData.questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex].options = newOptions;
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    const removeQuestion = (index) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, questions: newQuestions }));
    };

    return (
        <MainLayout fullWidth={true}>
            <div className="bg-[#f7f8f6] dark:bg-[#192111] min-h-screen p-8 font-display">
                <div className="max-w-4xl mx-auto">
                    {/* Page Heading */}
                    <div className="mb-8">
                        <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] uppercase">QUIZ EDITOR</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Create and configure a new interactive quiz.</p>
                    </div>

                    {status && (
                        <div className={`mb-6 p-4 border-2 border-slate-900 rounded ${status.type === 'error' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`}>
                            {status.message}
                        </div>
                    )}

                    {/* Quiz Details Form Section */}
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded border-2 border-slate-900 dark:border-lime-400 shadow-[4px_4px_0px_#000] mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex flex-col col-span-2">
                                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Quiz Title</p>
                                <input
                                    className="flex w-full rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 placeholder:text-slate-500 px-4 text-base font-normal leading-normal"
                                    placeholder="Enter the title for the quiz"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </label>
                            <label className="flex flex-col col-span-2">
                                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Description</p>
                                <textarea
                                    className="flex w-full resize-y rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 min-h-24 placeholder:text-slate-500 p-4 text-base font-normal leading-normal"
                                    placeholder="Provide a brief description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </label>
                            {/* Vault Selection */}
                            <label className="flex flex-col col-span-2 md:col-span-1">
                                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Vault</p>
                                <select
                                    className="flex w-full rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 px-4 text-base font-normal leading-normal"
                                    value={formData.vaultId || ''}
                                    onChange={(e) => setFormData({ ...formData, vaultId: e.target.value })}
                                >
                                    <option value="" disabled>Select a Vault</option>
                                    {vaults.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                                </select>
                            </label>
                            <label className="flex flex-col col-span-2 md:col-span-1">
                                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">XP Reward</p>
                                <input
                                    type="number"
                                    className="flex w-full rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 px-4 text-base font-normal leading-normal"
                                    value={formData.xpValue}
                                    onChange={(e) => setFormData({ ...formData, xpValue: e.target.value })}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded border-2 border-slate-900 dark:border-lime-400 shadow-[4px_4px_0px_#000]">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase">Questions</h2>
                        <div className="space-y-8">
                            {formData.questions.map((q, qImg) => (
                                <div key={qImg} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded p-4 relative bg-slate-50 dark:bg-slate-800/50">
                                    <div className="flex justify-between mb-4">
                                        <span className="font-bold text-slate-500">Question #{qImg + 1}</span>
                                        <button onClick={() => removeQuestion(qImg)} className="text-red-500 hover:text-red-700"><span className="material-symbols-outlined">delete</span></button>
                                    </div>

                                    <label className="flex flex-col mb-4">
                                        <p className="text-slate-900 dark:text-white text-sm font-bold uppercase pb-1">Question Text</p>
                                        <input
                                            className="flex w-full rounded border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-10 px-3 text-sm"
                                            value={q.text}
                                            onChange={(e) => updateQuestion(qImg, 'text', e.target.value)}
                                            placeholder="e.g., Which format is used for styling?"
                                        />
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        {q.options.map((opt, oIdx) => (
                                            <label key={oIdx} className="flex flex-col">
                                                <p className="text-slate-500 text-xs font-bold uppercase pb-1">Option {oIdx + 1}</p>
                                                <input
                                                    className="flex w-full rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 h-10 px-3 text-sm"
                                                    value={opt}
                                                    onChange={(e) => updateOption(qImg, oIdx, e.target.value)}
                                                />
                                            </label>
                                        ))}
                                    </div>

                                    <label className="flex flex-col md:w-1/3">
                                        <p className="text-slate-900 dark:text-white text-sm font-bold uppercase pb-1">Correct Option (Index 0-2)</p>
                                        <select
                                            className="flex w-full rounded border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-10 px-3 text-sm"
                                            value={q.correctAnswer}
                                            onChange={(e) => updateQuestion(qImg, 'correctAnswer', e.target.value)}
                                        >
                                            {q.options.map((_, idx) => (
                                                <option key={idx} value={idx}>Option {idx + 1}</option>
                                            ))}
                                        </select>
                                    </label>

                                </div>
                            ))}
                        </div>
                        {/* Add Question Button */}
                        <button
                            onClick={addQuestion}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded h-10 px-4 bg-violet-600 text-white text-sm font-bold leading-normal tracking-wide mt-6 border-2 border-slate-900 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-transform"
                        >
                            <span className="material-symbols-outlined">add</span>
                            <span className="truncate uppercase">Add Question</span>
                        </button>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-4 mt-8">
                        <button
                            onClick={() => navigate('/admin/cms')}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-6 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-wide border-2 border-slate-900 dark:border-slate-500 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-transform"
                        >
                            <span className="truncate uppercase">Cancel</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-6 bg-lime-400 text-slate-900 text-sm font-bold leading-normal tracking-wide border-2 border-slate-900 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_#000] transition-transform disabled:opacity-50"
                        >
                            <span className="truncate uppercase">{isLoading ? 'Saving...' : 'Save Quiz'}</span>
                        </button>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
