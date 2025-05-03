// app/auth/callback/route.ts
// ──────────────────────────
export const dynamic = 'force-dynamic';

import { cookies as nextCookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: Request): Promise<Response> {
  /* 1 · Ziel‑URL (Home) */
  const redirectUrl = new URL('/', request.url);

  /* 2 · Auth‑Code aus Query lesen */
  const code = new URL(request.url).searchParams.get('code');
  if (!code) return NextResponse.redirect(redirectUrl);

  /* 3 · Next‑Cookies → Wrapper im Supabase‑Format */
  const store = nextCookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /** Rückgabe MUSS string | undefined sein */
        get(name: string) {
          return store.get(name)?.value;
        },
        /** Supabase erwartet void‑Return */
        set(name: string, value: string, options?: CookieOptions) {
          store.set({ name, value, ...options });
        },
        /** Supabase erwartet void‑Return */
        remove(name: string, options?: CookieOptions) {
          store.delete({ name, ...options });
        },
      },
    }
  );

  /* 4 · Code → Session tauschen (setzt Cookies) */
  await supabase.auth.exchangeCodeForSession(code);

  /* 5 · Zurück in die App */
  return NextResponse.redirect(redirectUrl);
}
