import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Server‑Redirect zurück zur Startseite
  redirect(origin + '/');

  // ---- never reached, but satisfies Next.js type system ----
  return new Response(null, { status: 204 });
}
