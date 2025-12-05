import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Section from '../components/Section.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

const checkpoints = [
  { label: 'Watch lesson video', status: 'Done' },
  { label: 'Take quick quiz', status: 'Up next' },
  { label: 'Complete coding challenge', status: 'Locked' },
];

export default function LessonChallengeEditor() {
  return (
    <MainLayout fullWidth>
      <Section
        title="Lesson: Intro to Variables"
        description="Function Fortress / Zone 01"
        actions={<Button variant="accent">Start quiz</Button>}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden border border-onyx/10 shadow-depth">
          <div className="aspect-video rounded-lg bg-gradient-to-br from-deepViolet to-charcoal flex items-center justify-center text-softGold">
            <div className="rounded-full bg-ivory/10 p-4">
              <span className="material-symbols-outlined text-5xl">play_circle</span>
            </div>
          </div>
        </Card>
        <Card title="Your progress" className="space-y-4">
          {checkpoints.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-onyx dark:text-softGold">{item.label}</p>
                <p className="text-xs text-mutedSilver">{item.status}</p>
              </div>
              <ProgressBar value={item.status === 'Done' ? 100 : item.status === 'Up next' ? 50 : 20} className="w-32" />
            </div>
          ))}
          <Button variant="success" className="w-full">
            Continue path
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
}
