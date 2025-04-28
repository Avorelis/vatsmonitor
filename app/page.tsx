// app/page.tsx
import AuthButton from './components/AuthButton';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-4">
      <h1 className="text-4xl font-bold">VATSME Monitor</h1>
      <p className="text-lg">
        We help EU micro-sellers stay below VAT thresholds. 🚀
      </p>

      {/* ------- Login / Logout button ------- */}
      <AuthButton />

      <p className="mt-8 text-gray-500">Landing page coming soon…</p>
    </main>
  );
}
