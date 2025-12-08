import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../api/client.js';

export default function QuizView({ quest }) {
    const navigate = useNavigate();
    const { token, profile } = useAuth();

    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        // Parse content for questions
        try {
            if (quest.content) {
                const parsed = JSON.parse(quest.content);
                if (Array.isArray(parsed)) {
                    setQuestions(parsed);
                } else if (parsed.questions) {
                    setQuestions(parsed.questions);
                }
            } else {
                // Fallback/Demo Data if content is empty
                setQuestions([
                    {
                        question: "Which HTML tag is used to define an unordered list?",
                        options: ["<list>", "<ul>", "<ol>", "<li>"],
                        correctAnswer: "<ul>"
                    },
                    {
                        question: "What does CSS stand for?",
                        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
                        correctAnswer: "Cascading Style Sheets"
                    }
                ]);
            }
        } catch (e) {
            console.error("Failed to parse quiz content", e);
            // Fallback
            setQuestions([
                {
                    question: "Which HTML tag is used to define an unordered list?",
                    options: ["<list>", "<ul>", "<ol>", "<li>"],
                    correctAnswer: "<ul>"
                }
            ]);
        }
    }, [quest]);

    const handleOptionClick = (option) => {
        if (isSubmitted) return;
        setSelectedOption(option);
    };

    const handleSubmit = async () => {
        if (!selectedOption || isSubmitted) return;

        setIsSubmitted(true);
        const currentQ = questions[currentIdx];
        const isCorrect = selectedOption === currentQ.correctAnswer; // Simple string match for now

        if (isCorrect) {
            setScore(score + 1);
            setFeedback({ type: 'success', message: 'Correct! Great job.' });
        } else {
            setFeedback({ type: 'error', message: `Incorrect. The correct answer was ${currentQ.correctAnswer}.` });
        }

        // Prepare for next or finish
        // In a real app, maybe delay or wait for "Next" click. 
        // Here we'll let user review then click "Next" (which we reuse the button for).
    };

    const handleNext = async () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
            setFeedback(null);
        } else {
            // Finish
            // Submit score to backend?
            // For now, navigate back
            alert(`Quiz Complete! Score: ${score + (feedback?.type === 'success' ? 0 : 0)} / ${questions.length}`);
            navigate(-1);
        }
    };

    const currentQ = questions[currentIdx];
    const progress = Math.round(((currentIdx + 1) / questions.length) * 100);

    if (!currentQ) return <div className="p-10 font-display">Loading Quiz...</div>;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#7F00FF] dark:bg-[#171121] overflow-x-hidden font-display">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1">

                        {/* Header */}
                        <header className="flex items-center justify-between whitespace-nowrap border-2 border-slate-900 bg-white px-6 py-3 shadow-[4px_4px_0px_#000] rounded-lg text-slate-900">
                            <div className="flex items-center gap-4">
                                <div className="size-6 text-[#7937eb]">
                                    <span className="material-symbols-outlined text-3xl">pinch</span>
                                </div>
                                <h1 className="text-xl font-bold leading-tight tracking-[-0.015em]">Stitch</h1>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-900" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>exercise</span>
                                <span className="font-bold">Quiz: {quest.title}</span>
                            </div>
                            <div className="flex flex-1 justify-end">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-900"
                                    style={{ backgroundImage: `url("https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'User'}")` }}
                                ></div>
                            </div>
                        </header>

                        <main className="flex-1 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Question Column */}
                            <div className="flex flex-col gap-8">
                                <div className="bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] p-6 flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-bold text-[#7937eb] uppercase">QUESTION {currentIdx + 1} OF {questions.length}</p>
                                        <h2 className="text-2xl font-bold text-slate-900">{currentQ.question}</h2>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {currentQ.options.map((opt, idx) => {
                                            const letter = String.fromCharCode(65 + idx); // A, B, C...
                                            const isSelected = selectedOption === opt;

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionClick(opt)}
                                                    disabled={isSubmitted}
                                                    className={`flex items-center gap-4 w-full text-left p-4 border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7937eb] focus:ring-offset-2 ${isSelected ? 'bg-slate-100 ring-2 ring-[#7937eb]' : 'bg-white hover:bg-slate-50'}`}
                                                >
                                                    <div className={`flex items-center justify-center size-8 border-2 border-slate-900 rounded font-bold text-slate-900 ${isSelected ? 'bg-[#7937eb] text-white' : ''}`}>{letter}</div>
                                                    <span className="font-bold text-slate-900">{opt}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {!isSubmitted ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!selectedOption}
                                        className="w-full bg-[#52FF00] text-slate-900 font-bold text-lg py-4 px-6 border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] hover:bg-[#52FF00]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#7937eb] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Submit
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className="w-full bg-slate-900 text-white font-bold text-lg py-4 px-6 border-2 border-white rounded-lg shadow-[4px_4px_0px_#fff] hover:bg-slate-800 transition-colors focus:outline-none"
                                    >
                                        {currentIdx < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                                    </button>
                                )}
                            </div>

                            {/* Feedback / Context Column */}
                            <div className="flex flex-col">
                                <div className={`bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] p-6 flex-1 flex flex-col items-center justify-center text-center transition-colors ${feedback?.type === 'success' ? 'bg-[#52FF00]/20' : (feedback?.type === 'error' ? 'bg-[#FF00A8]/20' : '')}`}>

                                    {!feedback ? (
                                        <>
                                            <div className="p-4 bg-slate-100 rounded-full border-2 border-slate-900">
                                                <span className="material-symbols-outlined text-slate-500" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0, 'wght' 500" }}>quiz</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mt-6">Select an answer</h3>
                                            <p className="text-slate-600 mt-2 max-w-xs">Your feedback will appear here once you submit your answer.</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className={`p-4 rounded-full border-2 border-slate-900 ${feedback.type === 'success' ? 'bg-[#52FF00]' : 'bg-[#FF00A8]'}`}>
                                                <span className="material-symbols-outlined text-white" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1, 'wght' 700" }}>{feedback.type === 'success' ? 'check' : 'close'}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mt-6">{feedback.type === 'success' ? 'Correct!' : 'Incorrect'}</h3>
                                            <p className="text-slate-900 mt-2 max-w-xs font-bold">{feedback.message}</p>
                                        </>
                                    )}

                                </div>
                            </div>

                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
