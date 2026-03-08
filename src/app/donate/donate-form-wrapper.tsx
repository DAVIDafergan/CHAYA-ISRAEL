'use client';

import DonateForm from './donate-form';

export default function DonateFormWrapper({ cause }: { cause?: string }) {
  return <DonateForm cause={cause} />;
}
