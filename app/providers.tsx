// app/providers.tsx
'use client';

import { createBrowserClient, SupabaseClient } from '@supabase/ssr';
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

/* ---------- Context ---------- */
const SupabaseCtx = createContext<SupabaseClient | null>(null);

/** Hook, um den Client in Components zu nutzen */
export const useSupabase = () => {
  const ctx = useContext(SupabaseCtx);
  if (!ctx) throw new Error('useSupabase must be used within SupabaseProvider');
  return ctx;
};

/* ---------- Provider ---------- */
export default function SupabaseProvider({ children }: { children: ReactNode }) {
  // Client erst anlegen, wenn wir **wirklich im Browser** laufen
  const [supabase] = useState(() =>
    typeof window === 'undefined'
      ? null
      : createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
  );

  // Beim SSR/Build einfach nur die Kinder durchreichen
  if (!supabase) return <>{children}</>;

  return <SupabaseCtx.Provider value={supabase}>{children}</SupabaseCtx.Provider>;
}
