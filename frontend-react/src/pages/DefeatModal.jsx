import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';

export default function DefeatModal() {
  return (
    <MainLayout hideChrome>
      <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-charcoal via-deepViolet to-onyx">
        <Card className="max-w-md text-center border border-accentRose/50 shadow-glow bg-ivory">
          <h1 className="text-3xl font-display font-bold text-onyx">Defeat</h1>
          <p className="mt-2 text-sm text-mutedSilver">You can respawn and try the challenge again. Every loss is a data point.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="success">Try again</Button>
            <Button variant="secondary">View hints</Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
