import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const token = req.headers.get('cookie')?.includes('sb-access-token');
  if (!token && req.url.includes('/app')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/app/:path*'] };
