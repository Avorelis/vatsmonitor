// app/auth/callback/route.ts
// ──────────────────────────
// Supabase‑OAuth‑Callback  ➜  MUSS dynamisch erzeugt werden
export const dynamic = 'force-dynamic';

import { cookies as nextCookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request): Promise<Response> {
  /* 1 · Redirect‑Ziel vorbereiten */
  const redirectUrl = new URL('/', request.url);

  /* 2 · Code aus der Redirect‑URL lesen */
  const code = new URL(request.url).searchParams.get('code');
  if (!code) {
    // → ohne Code direkt zurück zur App
    return NextResponse.redirect(redirectUrl);
  }

  /* 3 · Cookie‑Store & Wrapper für Supabase */
  const store = nextCookies(); // ReadonlyRequestCookies

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => store.get(name),
        getAll: () => store.getAll(),
        set: (name, value, options) => store.set({ name, value, ...options }),
        delete: (name, options) => store.delete({ name, ...options }),
      },
    }
  );

  /* 4 · Auth‑Code gegen Session eintauschen (setzt Cookies) */
  await supabase.auth.exchangeCodeForSession(code);

  /* 5 · Erfolgreich – zurück in die App */
  return NextResponse.redirect(redirectUrl);
}
