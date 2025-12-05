import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import { Button } from '../components/Button.jsx';

export default function VictoryModal() {
  return (
    <MainLayout hideChrome>
      <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-accentLime/70 via-softGold/60 to-accentRose/60">
        <Card className="max-w-md text-center border border-onyx/20 shadow-depth">
          <h1 className="text-3xl font-display font-bold text-onyx">Victory!</h1>
          <p className="mt-2 text-sm text-mutedSilver">You cleared the vault challenge. Share your win or jump to the next quest.</p>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="accent">Share results</Button>
            <Button variant="success">Next quest</Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
