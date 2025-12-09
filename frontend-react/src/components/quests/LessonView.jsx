import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LessonView({ quest }) {
    const navigate = useNavigate();
    const { profile } = useAuth();

    // Placeholder: In a real implementation, we'd determine the "Next" ID.
    // For now, "Start Quiz" navigates back or to a placeholder.
    const handleStartQuiz = () => {
        // Navigate back to vault for now, or to next quest if known
        navigate(-1);
    };

    return (
        <MainLayout>
            <div className="flex flex-col w-full max-w-5xl mx-auto flex-1 font-display">
                {/* Header removed for Sidebar */}
                <main className="flex-1 mt-0">
                    {/* Back & Title */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center size-12 bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-transform"
                        >
                            <span className="material-symbols-outlined text-slate-900">arrow_back</span>
                        </button>
                        <div className="flex-1">
                            <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">{quest.title}</h1>
                            <p className="text-slate-600 dark:text-slate-400">{quest.description || 'Lesson View'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Video Player */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="relative bg-slate-900 border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] overflow-hidden aspect-video">
                                {quest.videoUrl ? (
                                    <iframe
                                        src={quest.videoUrl.replace('watch?v=', 'embed/')}
                                        title={quest.title}
                                        className="absolute inset-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/10 p-4 rounded-full">
                                            <span className="material-symbols-outlined text-white text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Markdown Content */}
                            {quest.content && (
                                <div className="bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] p-6 prose prose-slate max-w-none dark:prose-invert">
                                    <ReactMarkdown>{quest.content}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {/* Progress Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] p-6 flex flex-col gap-6">
                                <h2 className="text-2xl font-bold text-slate-900">Your Progress</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#52FF00] text-3xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>task_alt</span>
                                        <div>
                                            <h3 className="text-slate-900 font-bold">Watch Video</h3>
                                            <p className="text-gray-500 text-sm">Completed</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-lime-600 text-3xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 700" }}>quiz</span>
                                        <div>
                                            <h3 className="text-slate-900 font-bold">Take Quiz</h3>
                                            <p className="text-gray-500 text-sm">Up next</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-50">
                                        <span className="material-symbols-outlined text-slate-900 text-3xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>code</span>
                                        <div>
                                            <h3 className="text-slate-900 font-bold">Coding Challenge</h3>
                                            <p className="text-gray-500 text-sm">Locked</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleStartQuiz}
                                    className="w-full bg-lime-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-slate-900 shadow-[4px_4px_0px_#000] hover:bg-lime-500 hover:-translate-y-1 hover:-translate-x-1 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </MainLayout>
    );
}
