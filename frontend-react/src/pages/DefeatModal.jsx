import React from 'react';
import Modal from '../components/Modal.jsx';
import { Button } from '../components/Button.jsx';

export default function DefeatModal({ isOpen, onClose, onRetry, errors }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Defeat">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <span className="material-symbols-outlined text-6xl text-red-500">dangerous</span>
        </div>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
          The solution failed one or more test cases.
        </p>
        {errors && (
          <div className="mb-6 max-h-40 overflow-y-auto rounded bg-red-50 p-3 text-left font-mono text-xs text-red-600 border border-red-200">
            <pre>{errors}</pre>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <Button variant="success" onClick={onRetry}>
            Try again
          </Button>
          <Button variant="secondary" onClick={() => alert('Hint: Check input bounds.')}>
            View hints
          </Button>
        </div>
      </div>
    </Modal>
  );
}
