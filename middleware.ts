import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { req, res }
  );
  await supabase.auth.getSession();
  return res;
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};
