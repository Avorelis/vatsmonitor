// app/auth/callback/route.ts
import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Query-Parameter entfernen und zur Startseite
  redirect(origin + '/');
}
