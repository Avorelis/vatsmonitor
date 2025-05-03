// middleware.ts  (Next 13 / App Router)

import { NextResponse, type NextRequest } from 'next/server';
import {
  createServerClient,
  type CookieOptions,
} from '@supabase/ssr';

/**
 * Für alle Seiten‑/API‑Aufrufe einen Supabase‑Client bauen,
 * Cookies synchronisieren – entspricht dem alten
 * `createMiddlewareClient`, das in @supabase/ssr ≥0.6
 * nicht mehr vorhanden ist.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options: CookieOptions) =>
          res.cookies.set({ name: key, value, ...options }),
        remove: (key, options: CookieOptions) =>
          res.cookies.set({ name: key, value: '', ...options }),
      },
    },
  );

  /* 👉 falls Du hier eine Session brauchst:
  const { data: { session } } = await supabase.auth.getSession();
  */

  return res;
}

/**
 *  Alle Pfade außer statischen Assets abfangen
 *  – ggf. anpassen, falls Du nur bestimmte Routen schützen willst.
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
