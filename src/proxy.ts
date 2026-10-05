// Next.js Proxy (replaces middleware.ts for network request proxying & route guards)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/mentor/:path*', '/admin/:path*'],
};
