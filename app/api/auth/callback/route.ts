// app/api/auth/callback/route.ts
// –––––––––––––––––––––––––––––––
// 100 % Server – läuft in Cloudflare Functions (Edge) und
// wird NICHT von der Static‑Site‑Generation berührt.

import {
  createServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// optional, aber nützlich: direkt als Edge‑Runtime markieren
export const runtime = 'edge';

export async function GET(request: NextRequest): Promise<Response> {
  /* 1 · Auth‑Code aus Query */
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectUrl = new URL('/', request.url);

  if (!code) return NextResponse.redirect(redirectUrl);

  /* 2 · Next‑Cookies → Supabase‑Wrapper */
  const store = nextCookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: name => store.get(name)?.value,
        set: (name, value, options?: CookieOptions) =>
          store.set({ name, value, ...options }),
        remove: (name, options?: CookieOptions) =>
          store.delete({ name, ...options }),
      },
    },
  );

  /* 3 · Code ↔︎ Session */
  await supabase.auth.exchangeCodeForSession(code);

  /* 4 · Zurück nach Hause */
  return NextResponse.redirect(redirectUrl);
}
