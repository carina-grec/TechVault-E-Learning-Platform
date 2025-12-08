import React from 'react';
import Modal from '../components/Modal.jsx';
import { Button } from '../components/Button.jsx';

export default function VictoryModal({ isOpen, onClose, onNext, xp }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Victory!">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <span className="material-symbols-outlined text-6xl text-lime-500">trophy</span>
        </div>
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
          You cleared the vault challenge and earned <span className="font-bold text-lime-600">{xp || 0} XP</span>!
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="accent" onClick={() => alert('Shared to leaderboard!')}>
            Share results
          </Button>
          <Button variant="success" onClick={onNext}>
            Next quest
          </Button>
        </div>
      </div>
    </Modal>
  );
}
