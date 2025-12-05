import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';

export default function CoppaAgeVerification() {
  return (
    <MainLayout hideChrome>
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 bg-gradient-to-br from-softGold/60 via-sand to-accentRose/40 p-4">
        <Card className="w-full max-w-lg">
          <h1 className="text-2xl font-display font-bold text-onyx dark:text-softGold">First, let&apos;s verify your age.</h1>
          <p className="mt-2 text-sm text-mutedSilver">For safety and compliance, we need to confirm your birthdate.</p>
          <div className="mt-4 space-y-4">
            <Input id="dob" label="Enter your birthdate" placeholder="MM / DD / YYYY" />
            <Button className="w-full" variant="success" size="lg">
              Continue
            </Button>
          </div>
        </Card>

        <Card className="w-full max-w-lg border border-accentRose/40 shadow-depth">
          <h2 className="text-2xl font-display font-bold text-onyx dark:text-softGold">Looks like you need a hand!</h2>
          <p className="mt-2 text-sm text-mutedSilver">
            Users under 13 need a parent&apos;s permission to join TechVault. Ask them for help so we can keep your journey safe and fun.
          </p>
          <Button className="mt-4 w-full" variant="accent" size="lg">
            Ask a parent for help
          </Button>
        </Card>
      </div>
    </MainLayout>
  );
}
