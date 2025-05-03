// app/providers.tsx
'use client';

import { createBrowserClient, type CookieOptions } from '@supabase/ssr';
import { createContext, useState, type ReactNode } from 'react';

// Falls du später einen Hook verwenden möchtest:
export const SupabaseContext = createContext<ReturnType<
  typeof createBrowserClient
> | null>(null);

interface Props {
  children: ReactNode;
}

/**
 *   SupabaseProvider
 *   ----------------
 *   Stellt den auf Browser‑Seite initialisierten Supabase‑Client
 *   per React‑Context zur Verfügung.
 */
export default function SupabaseProvider({ children }: Props) {
  // Den Client nur einmal pro Browser-Session anlegen
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        // OPTIONAL: Hier kannst du Cookie‑Optionen setzen,
        // z.B. um das Persist‑Verhalten anzupassen.
        cookies: {
          // Beispiel: Zugriff nur SameSite=Lax
          set: (_name: string, _value: string, _options?: CookieOptions) => {},
          get: () => undefined,
          remove: () => {},
        },
      }
    )
  );

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
