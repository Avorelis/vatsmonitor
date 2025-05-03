// middleware.ts

import { NextResponse, type NextRequest } from 'next/server';
import {
  createServerClient,
  type CookieOptions,
} from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /* 1 · Auslesen */
        get: (name: string) => req.cookies.get(name)?.value,

        /* 2 · Setzen →  nichts zurückgeben (void!) */
        set: (name: string, value: string, options: CookieOptions) => {
          res.cookies.set({ name, value, ...options });
        },

        /* 3 · Löschen →  ebenfalls void   */
        remove: (name: string, options: CookieOptions) => {
          // Next 13 hat kein delete; empty + expires = Vergangenheit
          res.cookies.set({ name, value: '', expires: new Date(0), ...options });
        },
      },
    },
  );

  /* ➜ falls Du hier Session‑Checks brauchst, kannst Du supabase benutzen */

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
