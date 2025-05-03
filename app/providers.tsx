'use client';

import { createBrowserClient } from '@supabase/ssr';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';

type SupabaseCtx = {
  supabase: ReturnType<typeof createBrowserClient>;
  session: Session | null;
  loading: boolean;
};

const SupabaseContext = createContext<SupabaseCtx | undefined>(undefined);

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error('SupabaseProvider missing');
  return ctx;
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}
