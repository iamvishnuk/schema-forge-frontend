import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/confirm-account',
  '/forgot-password',
  '/reset-password',
  '/verify-mfa'
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the path matches any of the public routes
  const isPublicRoute = publicRoutes.some((route) => path === route);

  const accessToken = req.cookies.get('accessToken')?.value;

  console.log('Middleware Running on:', path);

  if (path === '/') return NextResponse.next();

  if (!isPublicRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};
