import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';

const steps = [
  { title: 'Watch video', state: 'Completed' },
  { title: 'Take quiz', state: 'Up next' },
  { title: 'Coding challenge', state: 'Locked' },
];

export default function VaultMapOne() {
  return (
    <MainLayout fullWidth>
      <div className="flex flex-wrap items-center gap-3 pb-6">
        <Button variant="secondary" size="sm">
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-onyx dark:text-softGold">Lesson: Intro to Variables</h1>
          <p className="text-sm text-mutedSilver">Function Fortress / Zone 01</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden border border-onyx/10 shadow-depth">
          <div className="aspect-video rounded-lg bg-gradient-to-br from-deepViolet to-charcoal flex items-center justify-center text-softGold">
            <div className="rounded-full bg-ivory/10 p-4">
              <span className="material-symbols-outlined text-5xl">play_circle</span>
            </div>
          </div>
        </Card>
        <Card title="Your progress" className="space-y-4">
          {steps.map((step) => (
            <div key={step.title} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-onyx dark:text-softGold">{step.title}</p>
                <p className="text-xs text-mutedSilver">{step.state}</p>
              </div>
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-charcoal">{step.state}</span>
            </div>
          ))}
          <Button variant="accent" className="w-full">
            Start quiz
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
}
