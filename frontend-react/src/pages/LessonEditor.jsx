import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LessonEditor() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const lessonId = searchParams.get('id');
    console.log("LessonEditor Loaded. ID:", lessonId); // DEBUG: Verify code update

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        xpValue: 50,
        content: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const [vaults, setVaults] = useState([]);

    useEffect(() => {
        if (token) {
            api.getAdminVaults(token).then(setVaults).catch(console.error);
            if (lessonId) loadLesson(lessonId);
        }
    }, [token, lessonId]);

    const loadLesson = async (id) => {
        setIsLoading(true);
        try {
            const data = await api.getQuest(id, token);
            setFormData({
                ...data,
                vaultId: data.vaultId || ''
            });
        } catch (err) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setStatus({ type: 'loading', message: 'Saving lesson...' });
        try {
            const payload = { ...formData, type: 'LESSON' };
            if (lessonId) {
                await api.updateQuest(token, lessonId, payload);
            } else {
                await api.createQuest(token, payload);
            }
            setStatus({ type: 'success', message: 'Lesson saved successfully!' });
            setTimeout(() => navigate('/admin/cms'), 1500);
        } catch (err) {
            setStatus({ type: 'error', message: err.message });
        }
    };

    return (
        <MainLayout fullWidth={true}>
            <div className="bg-[#f7f8f6] dark:bg-[#192111] min-h-screen p-8 font-display">
                <div className="max-w-4xl mx-auto">
                    {/* Page Heading */}
                    <div className="mb-8">
                        <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] uppercase">LESSON EDITOR</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Create and configure a new educational lesson.</p>
                    </div>

                    {status && (
                        <div className={`mb-6 p-4 border-2 border-slate-900 rounded ${status.type === 'error' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`}>
                            {status.message}
                        </div>
                    )}

                    {/* Lesson Details Form Section */}
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded border-2 border-slate-900 dark:border-lime-400 shadow-[4px_4px_0px_#000] mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Lesson Title */}
                            <label className="flex flex-col col-span-2">
                                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Lesson Title</p>
                                <input
                                    className="flex w-full rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 placeholder:text-slate-500 px-4 text-base font-normal leading-normal"
                                    placeholder="Enter the title for the lesson"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </label>
                            {/* Description */}
                            <label className="flex flex-col col-span-2">
                                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Description</p>
                                <textarea
                                    className="flex w-full resize-y rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 min-h-24 placeholder:text-slate-500 p-4 text-base font-normal leading-normal"
                                    placeholder="Provide a brief description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </label>
                            <label className="flex flex-col col-span-2 md:col-span-1">
                                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Video URL</p>
                                <input
                                    className="flex w-full rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 placeholder:text-slate-500 px-4 text-base font-normal leading-normal"
                                    placeholder="https://youtube.com/..."
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
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
                            {/* XP Value */}
                            <label className="flex flex-col col-span-2 md:col-span-1">
                                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">XP Reward</p>
                                <input
                                    type="number"
                                    className="flex w-full rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 px-4 text-base font-normal leading-normal"
                                    value={formData.xpValue}
                                    onChange={(e) => setFormData({ ...formData, xpValue: e.target.value })}
                                />
                            </label>
                            {/* Content Body */}
                            <label className="flex flex-col col-span-2">
                                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Content (Markdown)</p>
                                <textarea
                                    className="font-mono flex w-full resize-y rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 min-h-64 placeholder:text-slate-500 p-4 text-sm font-normal leading-normal"
                                    placeholder="# Lesson Content\n\nExplain the concepts here..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </label>
                        </div>
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
                            <span className="truncate uppercase">{isLoading ? 'Saving...' : 'Save Lesson'}</span>
                        </button>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
