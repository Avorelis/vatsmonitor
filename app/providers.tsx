// app/providers.tsx
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  type ReactNode,
  createContext,
  useContext,
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
  // Client erst im Browser erzeugen
  const [supabase] = useState(() =>
    typeof window === 'undefined'
      ? null
      : createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
  );

  if (!supabase) return <>{children}</>;

  return <SupabaseCtx.Provider value={supabase}>{children}</SupabaseCtx.Provider>;
}
