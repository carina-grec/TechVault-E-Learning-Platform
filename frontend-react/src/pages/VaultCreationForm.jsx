import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function VaultCreationForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (editId && token) {
      api.getVaultDetail(editId, token).then(data => {
        const v = data.vault;
        setFormData({
          title: v.title || '',
          description: v.description || '',
          category: v.category || '',
          difficulty: v.difficulty || '',
          tags: v.tags ? v.tags.join(', ') : '',
        });
      }).catch(err => setStatus({ type: 'error', message: 'Failed to load vault: ' + err.message }));
    }
  }, [editId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const payload = {
        ...formData,
        status: 'DRAFT',
        displayOrder: 1,
        theme: 'cyberpunk',
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
      };

      if (editId) {
        // Assuming updateVault endpoint exists or standard PUT
        await api.updateVault(token, editId, payload);
        setStatus({ type: 'success', message: 'Vault updated successfully!' });
      } else {
        await api.createVault(token, payload);
        setStatus({ type: 'success', message: 'Vault created successfully!' });
      }
      setTimeout(() => navigate('/admin/cms'), 1500);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout fullWidth={true}>
      <div className="min-h-screen p-4 sm:p-10 font-display flex flex-col items-center">
        <div className="w-full max-w-[960px]">
          {/* Header */}
          <div className="flex flex-wrap justify-between gap-3 p-4 mb-8">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">{editId ? 'Edit Vault' : 'Create New Vault'}</h1>
          </div>

          {status && (
            <div className={`mb-6 p-4 border-2 border-slate-900 rounded ${status.type === 'error' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`}>
              {status.message}
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white dark:bg-slate-900/50 p-8 border-2 border-slate-900 dark:border-slate-600 rounded shadow-[4px_4px_0px_#000]">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-base font-bold leading-normal pb-2">Vault Title</p>
                  <input
                    required
                    className="flex w-full resize-none overflow-hidden rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 placeholder:text-slate-400 p-3 text-base font-normal leading-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
                    placeholder="e.g., Introduction to Python"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </label>
                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-base font-bold leading-normal pb-2">Description</p>
                  <textarea
                    required
                    className="flex w-full resize-y overflow-hidden rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 min-h-36 placeholder:text-slate-400 p-3 text-base font-normal leading-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
                    placeholder="A brief summary of what this vault contains."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </label>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col">
                    <p className="text-slate-800 dark:text-slate-200 text-base font-bold leading-normal pb-2">Category</p>
                    <select
                      required
                      className="flex w-full appearance-none overflow-hidden rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 p-3 text-base font-normal leading-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="web-dev">Web Development</option>
                      <option value="data-science">Data Science</option>
                      <option value="machine-learning">Machine Learning</option>
                    </select>
                  </label>
                  <label className="flex flex-col">
                    <p className="text-slate-800 dark:text-slate-200 text-base font-bold leading-normal pb-2">Difficulty Level</p>
                    <select
                      required
                      className="flex w-full appearance-none overflow-hidden rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 p-3 text-base font-normal leading-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    >
                      <option value="" disabled>Select a level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </label>
                </div>
                <label className="flex flex-col">
                  <p className="text-slate-800 dark:text-slate-200 text-base font-bold leading-normal pb-2">Tags</p>
                  <input
                    className="flex w-full resize-none overflow-hidden rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 placeholder:text-slate-400 p-3 text-base font-normal leading-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
                    placeholder="e.g., python, beginner, algorithms"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/cms')}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded border-2 border-slate-900 dark:border-slate-500 bg-white dark:bg-slate-800 px-6 h-12 text-slate-800 dark:text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[4px_4px_0px_#000] hover:bg-slate-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  <span className="truncate">Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded border-2 border-slate-900 bg-violet-600 px-6 h-12 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-[4px_4px_0px_#000] hover:bg-violet-700 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
                >
                  <span className="truncate">{isLoading ? (editId ? 'Updating...' : 'Creating...') : (editId ? 'Update Vault' : 'Create Vault')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
