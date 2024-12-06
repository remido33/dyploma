
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');

  if (request.nextUrl.pathname.startsWith('/login')) {
    if(token) {
      const storeId = request.cookies.get('storeId')?.value;
      if(storeId)
        return NextResponse.redirect(new URL(`/dashboard/${storeId}`, request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/verify')) {
    const userId = request.cookies.get('userId');

    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }
};
