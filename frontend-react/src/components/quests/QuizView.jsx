import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout.jsx';
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

    const handleOptionClick = (idx) => {
        if (isSubmitted) return;
        setSelectedOption(idx);
    };

    const handleSubmit = async () => {
        if (selectedOption === null || isSubmitted) return;

        setIsSubmitted(true);
        const currentQ = questions[currentIdx];
        // Backend sends "0" as string, ensure we parse it. Fallback to direct comparison if not a number string.
        const correctIdx = parseInt(currentQ.correctAnswer);

        // Check if logic matches: Select Option (int) === Correct Index (int)
        // OR legacy: Selected Option (string) === Correct Answer (string)
        const isCorrect = !isNaN(correctIdx)
            ? selectedOption === correctIdx
            : selectedOption === currentQ.correctAnswer;

        if (isCorrect) {
            setScore(score + 1);
            setFeedback({ type: 'success', message: 'Correct! Great job.' });
        } else {
            const correctText = !isNaN(correctIdx)
                ? currentQ.options[correctIdx]
                : currentQ.correctAnswer;
            setFeedback({ type: 'error', message: `Incorrect. The correct answer was: ${correctText}` });
        }

        // Prepare for next or finish
    };

    const handleNext = async () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
            setFeedback(null);
        } else {
            // Finish
            alert(`Quiz Complete! Score: ${score + (feedback?.type === 'success' ? 0 : 0)} / ${questions.length}`);
            navigate(-1);
        }
    };

    const currentQ = questions[currentIdx];
    const progress = Math.round(((currentIdx + 1) / questions.length) * 100);

    if (!currentQ) return <div className="p-10 font-display">Loading Quiz...</div>;

    return (
        <MainLayout>
            <div className="flex flex-col w-full max-w-7xl mx-auto flex-1 font-display">
                <div className="hidden md:flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-slate-900" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>exercise</span>
                    <span className="font-bold text-slate-900">Quiz: {quest.title}</span>
                </div>

                <div className="flex-1 mt-0 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                    {/* Question Column */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-bold text-lime-600 uppercase">QUESTION {currentIdx + 1} OF {questions.length}</p>
                                {/* Backend uses 'text', Legacy uses 'question' */}
                                <h2 className="text-2xl font-bold text-slate-900">{currentQ.text || currentQ.question}</h2>
                            </div>
                            <div className="flex flex-col gap-4">
                                {currentQ.options.map((opt, idx) => {
                                    const letter = String.fromCharCode(65 + idx); // A, B, C...
                                    const isSelected = selectedOption === idx; // Compare indices

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionClick(idx)} // Pass index
                                            disabled={isSubmitted}
                                            className={`flex items-center gap-4 w-full text-left p-4 border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 ${isSelected ? 'bg-slate-100 ring-2 ring-lime-500' : 'bg-white hover:bg-slate-50'}`}
                                        >
                                            <div className={`flex items-center justify-center size-8 border-2 border-slate-900 rounded font-bold text-slate-900 ${isSelected ? 'bg-lime-500 text-white' : ''}`}>{letter}</div>
                                            <span className="font-bold text-slate-900">{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {!isSubmitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedOption === null}
                                className="w-full bg-lime-500 text-slate-900 font-bold text-lg py-4 px-6 border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] hover:bg-lime-400 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className={`bg-white border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_#000] p-6 flex-1 flex flex-col items-center justify-center text-center transition-colors ${feedback?.type === 'success' ? 'bg-lime-100' : (feedback?.type === 'error' ? 'bg-red-50' : '')}`}>

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
                                    <div className={`p-4 rounded-full border-2 border-slate-900 ${feedback.type === 'success' ? 'bg-lime-500' : 'bg-red-500'}`}>
                                        <span className="material-symbols-outlined text-white" style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1, 'wght' 700" }}>{feedback.type === 'success' ? 'check' : 'close'}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mt-6">{feedback.type === 'success' ? 'Correct!' : 'Incorrect'}</h3>
                                    <p className="text-slate-900 mt-2 max-w-xs font-bold">{feedback.message}</p>
                                </>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
