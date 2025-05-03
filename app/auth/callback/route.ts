// app/auth/callback/route.ts
// ──────────────────────────
// Supabase‑OAuth‑Callback – muss dynamisch bleiben!
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  // 1 · Code aus der Redirect‑URL auslesen
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    redirect('/'); // kein Code → zurück zur Startseite
  }

  // 2 · Supabase‑Server‑Client mit Cookie‑Helpers initialisieren
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  // 3 · Code gegen Session eintauschen (setzt Auth‑Cookies)
  await supabase.auth.exchangeCodeForSession(code);

  // 4 · Zurück in die App
  redirect('/');
}
