// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  // Debug logging to inspect available cookies in the request
  console.log('Cookies:', req.cookies);

  // Retrieve token from cookies
  const token = req.cookies.get('token');

  // If no token is found, redirect to login
  if (!token) {
    console.log('No token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home/:path*',
    '/clients/:path*',
    '/products/:path*',
    '/reminders/:path*',
    '/users/:path*',
    '/settings/:path*',
  ],
};
