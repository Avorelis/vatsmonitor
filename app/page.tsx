// app/page.tsx
'use client';

import AuthButton from './components/AuthButton';
import { useTransition } from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-6">
      <h1 className="text-4xl font-bold">VATSME Monitor</h1>
      <p className="text-lg text-center">
        We help EU micro‑sellers stay below VAT thresholds. 🚀
      </p>

      <AuthButton />

      {/* -- only show trial button to logged‑in users -- */}
      <TrialButton priceId="price_1RKHoGBNpXom3x7GAJEMYayL" />

      <p className="mt-6 text-gray-500">Landing page coming soon…</p>
    </main>
  );
}

/* -------- TrialButton component -------- */
function TrialButton({ priceId }: { priceId: string }) {
  const [pending, start] = useTransition();

  function handleClick() {
    start(async () => {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ priceId }),
      });
      const { url } = await res.json();
      window.location.href = url;
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
    >
      {pending ? 'Redirecting…' : 'Start 14‑day free trial'}
    </button>
  );
}
