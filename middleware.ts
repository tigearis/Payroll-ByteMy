// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route patterns
const publicRoutes = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/api/webhooks(.*)',
  '/api/holidays/sync',
]);

const adminRoutes = createRouteMatcher([
  '/admin(.*)',
  '/sign-up(.*)',
  '/settings(.*)',
]);

const managerRoutes = createRouteMatcher([
  '/clients/new(.*)',
  '/payrolls/new(.*)',
  '/staff(.*)',
]);

// Load the Admin Bypass Token from .env
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes for everyone
  if (publicRoutes(req)) {
    return;
  }

  // ✅ Bypass authentication if the correct API key is provided
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader === `Bearer ${CLERK_SECRET_KEY}`) {

    console.log("Incoming Authorization Header:", authHeader);
    console.log('Admin key used: Bypassing Clerk authentication');
    return;
  }

  const { userId, getToken } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  try {
    // Get the token with Hasura claims
    const token = await getToken({ template: 'hasura' });

    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Decode the JWT to get the claims
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const hasuraClaims = payload['https://hasura.io/jwt/claims'];

    if (!hasuraClaims) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const userRole = hasuraClaims['x-hasura-default-role'];

    // Protect admin routes
    if (adminRoutes(req) && !['org_admin', 'admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Protect manager routes
    if (managerRoutes(req) && !['org_admin', 'admin', 'manager'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.png$).*)'],
};
