// app/api/auth/callback/route.ts
//--------------------------------------------------
// Läuft ausschliesslich als Edge‑/Server‑Route
// (keine SSG, daher kein Konflikt mit Static Export)

import {
  createServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';          // explizit als Edge‑Func

export async function GET(req: NextRequest): Promise<Response> {
  /* 1 · Auth‑Code aus Query lesen */
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const redirect = new URL('/', req.url);

  if (!code) return NextResponse.redirect(redirect);

  /* 2 · Next‑Cookies → Adapter, der exakt
        dem von @supabase/ssr erwarteten Interface entspricht */
  const store = nextCookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return store.get(name)?.value;           // string | undefined
        },
        set(name, value, options?: CookieOptions) {
          store.set({ name, value, ...options });  // void (kein Return!)
        },
        remove(name, options?: CookieOptions) {
          store.delete({ name, ...options });      // void
        },
      },
    },
  );

  /* 3 · Code ↔︎ Session tauschen (setzt die Cookies) */
  await supabase.auth.exchangeCodeForSession(code);

  /* 4 · Zurück auf die Startseite */
  return NextResponse.redirect(redirect);
}
