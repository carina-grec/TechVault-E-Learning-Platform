import React from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';

export default function ParentalConsentForm() {
  return (
    <MainLayout>
      <Card className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-display font-bold text-onyx dark:text-softGold">Parental consent form</h1>
        <p className="text-sm text-mutedSilver">We need a parent or guardian to approve account creation.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="guardian-name" label="Guardian name" placeholder="Alex Doe" />
          <Input id="child-name" label="Child name" placeholder="Jamie Doe" />
          <Input id="email" label="Guardian email" type="email" placeholder="guardian@email.com" />
          <Input id="phone" label="Phone number" placeholder="+1 555 123 4567" />
        </div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-onyx/40 text-deepViolet focus:ring-deepViolet" />
          <span className="text-mutedSilver">
            I consent to my child creating an account on TechVault and understand data will be processed according to the privacy policy.
          </span>
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="secondary">Save draft</Button>
          <Button variant="success">Submit consent</Button>
        </div>
      </Card>
    </MainLayout>
  );
}
