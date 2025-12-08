import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-lime-400 rounded-lg shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_theme(colors.lime.400)] animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-2 border-slate-900 dark:border-lime-400 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                    <h2 className="text-xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>

                {/* Footer (Optional, can be part of children but adding Close button here is often standard, though Header has one too) */}
                <div className="flex justify-end p-4 border-t-2 border-slate-900 dark:border-lime-400 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 border-2 border-slate-900 dark:border-slate-500 rounded font-bold text-sm shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
