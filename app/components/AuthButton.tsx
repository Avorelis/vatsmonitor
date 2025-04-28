'use client';

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthButton() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  async function signIn() {
    const email = prompt('Enter your email for magic link:');
    if (email) {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) alert(error.message);
      else alert('Check your inbox for the login link!');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  if (!session)
    return (
      <button
        onClick={signIn}
        className="rounded bg-emerald-600 px-4 py-2 text-white"
      >
        Log in
      </button>
    );

  return (
    <button
      onClick={signOut}
      className="rounded bg-gray-200 px-4 py-2 text-gray-800"
    >
      Log out
    </button>
  );
}
