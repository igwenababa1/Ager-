// middleware/advanced-auth.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { DefenseClerkManager } from '../lib/advanced-clerk-setup';

const defenseManager = new DefenseClerkManager();

const isProtectedRoute = createRouteMatcher([
  '/defense-projects(.*)',
  '/classified(.*)',
  '/admin(.*)',
  '/api/secure(.*)',
]);

const isHighlySensitiveRoute = createRouteMatcher([
  '/top-secret(.*)',
  '/api/defense(.*)',
  '/weapon-systems(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionId } = await auth();
  
  if (isProtectedRoute(req)) {
    if (!userId) {
      return Response.redirect(new URL('/sign-in', req.url));
    }

    // Enhanced security for highly sensitive routes
    if (isHighlySensitiveRoute(req)) {
      const isAuthorized = await defenseManager.verifyDefenseUser(userId, {
        ipAddress: req.headers.get('x-forwarded-for'),
        userAgent: req.headers.get('user-agent'),
        requiredClearance: 5
      });

      if (!isAuthorized) {
        return new Response('Unauthorized - Insufficient Clearance', { status: 403 });
      }
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/api/:path*',
  ],
};