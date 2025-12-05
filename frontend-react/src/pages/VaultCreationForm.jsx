import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';

export default function VaultCreationForm() {
  return (
    <MainLayout>
      <Card className="max-w-4xl space-y-4">
        <h1 className="text-2xl font-display font-bold text-onyx dark:text-softGold">Create new vault</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="vault-title" label="Vault title" placeholder="Introduction to Python" />
          <Input id="vault-category" label="Category" placeholder="Web Development" />
          <Input id="vault-difficulty" label="Difficulty level" placeholder="Beginner" />
          <Input id="vault-tags" label="Tags" placeholder="python, basics, loops" />
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-onyx dark:text-softGold">Description</span>
          <textarea className="min-h-32 rounded-lg border border-onyx/20 bg-white p-3 text-sm text-onyx shadow-soft focus:border-deepViolet focus:outline-none dark:border-mutedSilver/30 dark:bg-onyx dark:text-mutedSilver" placeholder="Brief summary of what this vault contains." />
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button variant="accent">Create vault</Button>
        </div>
      </Card>
    </MainLayout>
  );
}
