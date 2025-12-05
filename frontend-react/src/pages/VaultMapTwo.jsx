import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';

const steps = [
  { title: 'Explore vault map', state: 'Completed' },
  { title: 'Unlock mini-quest', state: 'In progress' },
  { title: 'Boss challenge', state: 'Locked' },
];

export default function VaultMapTwo() {
  return (
    <MainLayout fullWidth>
      <div className="flex flex-wrap items-center gap-3 pb-6">
        <Button variant="secondary" size="sm">
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-onyx dark:text-softGold">Vault map — Creative Coding</h1>
          <p className="text-sm text-mutedSilver">Zone 02</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden border border-onyx/10 shadow-depth">
          <div className="aspect-video rounded-lg bg-gradient-to-br from-accentBlue/40 via-softGold/60 to-accentRose/50 flex items-center justify-center text-charcoal">
            <span className="text-lg font-semibold">Interactive map placeholder</span>
          </div>
        </Card>
        <Card title="Milestones" className="space-y-4">
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
            Continue path
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
}
