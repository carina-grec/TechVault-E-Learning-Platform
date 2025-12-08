import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function QuestEditor() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questId = searchParams.get('id');

  const [formData, setFormData] = useState({
    title: 'Array Summation Challenge',
    description: 'Write a function that takes an array of numbers and returns their sum.',
    difficulty: 'Easy',
    type: 'CODE_CHALLENGE',
    language: 'python',
    xpValue: 100,
    testCases: [
      { input: '[1, 2, 3]', expectedOutput: '6', hidden: false },
      { input: '[-1, 0, 1]', expectedOutput: '0', hidden: true }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    if (token) {
      api.getAdminVaults(token).then(setVaults).catch(console.error);
      if (questId) loadQuest(questId);
    }
  }, [questId, token]);

  const loadQuest = async (id) => {
    setIsLoading(true);
    try {
      const data = await api.getQuest(token, id); // Assuming this API exists
      // specific mapping might be needed depending on API response
      setFormData({
        ...data,
        testCases: data.testCases || [],
        difficulty: data.difficulty || 'Easy'
      });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setStatus({ type: 'loading', message: 'Saving quest...' });
    try {
      if (questId) {
        await api.updateQuest(token, questId, formData);
      } else {
        await api.createQuest(token, formData);
      }
      setStatus({ type: 'success', message: 'Quest saved successfully!' });
      setTimeout(() => navigate('/admin/cms'), 1500);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', hidden: false }]
    }));
  };

  const updateTestCase = (index, field, value) => {
    const newCases = [...formData.testCases];
    newCases[index] = { ...newCases[index], [field]: value };
    setFormData(prev => ({ ...prev, testCases: newCases }));
  };

  const removeTestCase = (index) => {
    const newCases = formData.testCases.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, testCases: newCases }));
  };

  return (
    <MainLayout fullWidth={true}>
      <div className="bg-[#f7f8f6] dark:bg-[#192111] min-h-screen p-8 font-display">
        <div className="max-w-4xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] uppercase">QUEST EDITOR</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Create and configure a new coding challenge for students.</p>
          </div>

          {status && (
            <div className={`mb-6 p-4 border-2 border-slate-900 rounded ${status.type === 'error' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`}>
              {status.message}
            </div>
          )}

          {/* Quest Details Form Section */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded border-2 border-slate-900 dark:border-lime-400 shadow-[4px_4px_0px_#000] mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quest Title */}
              <label className="flex flex-col col-span-2">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Quest Title</p>
                <input
                  className="flex w-full rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 placeholder:text-slate-500 px-4 text-base font-normal leading-normal"
                  placeholder="Enter the title for the quest"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </label>
              {/* Description */}
              <label className="flex flex-col col-span-2">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Description</p>
                <textarea
                  className="flex w-full resize-y rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 min-h-36 placeholder:text-slate-500 p-4 text-base font-normal leading-normal"
                  placeholder="Provide a detailed description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </label>
              {/* Vault Selection */}
              <label className="flex flex-col min-w-40 flex-1">
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
              {/* Language Selection */}
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Language</p>
                <select
                  className="flex w-full rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 px-4 text-base font-normal leading-normal"
                  value={formData.language || 'python'}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="python">Python (3.10)</option>
                  <option value="java">Java (15)</option>
                  <option value="javascript">JavaScript (Node 18)</option>
                </select>
              </label>
              {/* Difficulty Level */}
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Difficulty Level</p>
                <select
                  className="flex w-full rounded text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 px-4 text-base font-normal leading-normal"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </label>
              {/* XP Value */}
              <label className="flex flex-col min-w-40 flex-1">
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

          {/* Test Cases Section */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded border-2 border-slate-900 dark:border-lime-400 shadow-[4px_4px_0px_#000]">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase">Test Cases</h2>
            <div className="space-y-6">
              {formData.testCases.map((tc, idx) => (
                <div key={idx} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded p-4 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col">
                      <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Input</p>
                      <textarea
                        className="font-mono flex w-full resize-y rounded text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 bg-slate-900 min-h-32 p-4 text-sm"
                        value={tc.input}
                        onChange={(e) => updateTestCase(idx, 'input', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-slate-900 dark:text-white text-base font-bold leading-normal pb-2 uppercase pt-0">Expected Output</p>
                      <textarea
                        className="font-mono flex w-full resize-y rounded text-white focus:outline-0 focus:ring-2 focus:ring-lime-400 border-2 border-slate-900 bg-slate-900 min-h-32 p-4 text-sm"
                        value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(idx, 'expectedOutput', e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded-sm border-2 border-slate-900 dark:border-lime-400 bg-white dark:bg-slate-800 text-slate-900 focus:ring-0 focus:ring-offset-0"
                        checked={tc.hidden}
                        onChange={(e) => updateTestCase(idx, 'hidden', e.target.checked)}
                      />
                      <span className="text-slate-900 dark:text-white font-medium">Hidden</span>
                    </label>
                    <button
                      onClick={() => removeTestCase(idx)}
                      className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Add Test Case Button */}
            <button
              onClick={addTestCase}
              className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded h-10 px-4 bg-violet-600 text-white text-sm font-bold leading-normal tracking-wide mt-6 border-2 border-slate-900 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-transform"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="truncate uppercase">Add Test Case</span>
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
              <span className="truncate uppercase">{isLoading ? 'Saving...' : 'Save Quest'}</span>
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
