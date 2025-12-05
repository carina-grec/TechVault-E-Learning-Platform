import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';

export default function QuestEditor() {
  return (
    <MainLayout>
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm uppercase tracking-wide text-mutedSilver">Arcade</p>
            <h1 className="text-2xl font-display font-bold text-onyx dark:text-softGold">Quest editor</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Preview</Button>
            <Button variant="accent">Publish</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="quest-title" label="Quest title" placeholder="Build a landing page" />
          <Input id="quest-type" label="Quest type" placeholder="Frontend • Beginner" />
          <Input id="quest-reward" label="XP reward" placeholder="250 XP" />
          <Input id="quest-duration" label="Estimated duration" placeholder="45 minutes" />
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-onyx dark:text-softGold">Quest brief</span>
          <textarea className="min-h-32 rounded-lg border border-onyx/20 bg-white p-3 text-sm text-onyx shadow-soft focus:border-deepViolet focus:outline-none dark:border-mutedSilver/30 dark:bg-onyx dark:text-mutedSilver" placeholder="Describe goals, completion criteria, and hints." />
        </label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="quest-assets" label="Assets link" placeholder="https://assets.techvault.dev/quest.zip" />
          <Input id="quest-tags" label="Tags" placeholder="html, css, layout" />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost">Duplicate</Button>
          <Button variant="success">Save draft</Button>
        </div>
      </Card>
    </MainLayout>
  );
}
