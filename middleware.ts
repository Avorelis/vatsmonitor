import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();   // hängt Session an req.locals
  return res;
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};
