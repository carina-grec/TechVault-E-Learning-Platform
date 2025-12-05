import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';

export default function ParentalConsentRequest() {
  return (
    <MainLayout hideChrome>
      <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-ivory via-sand to-softGold px-4">
        <Card className="max-w-xl space-y-4">
          <h1 className="text-2xl font-display font-bold text-onyx">Request parental approval</h1>
          <p className="text-sm text-mutedSilver">Send a consent email to a parent or guardian to finish account setup.</p>
          <Input id="guardian-email" label="Guardian email" type="email" placeholder="parent@email.com" />
          <Input id="message" label="Personal note" placeholder="Hi! Please approve my TechVault account." />
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1">
              Preview email
            </Button>
            <Button variant="accent" className="flex-1">
              Send request
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
