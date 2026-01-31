import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/admin/:path*',
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    // The credentials are in base64, so we need to decode them
    const [user, pwd] = atob(authValue).split(':');

    // These credentials should be set as environment variables in your hosting provider.
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (user === adminUser && pwd === adminPass) {
      return NextResponse.next();
    }
  }
  
  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
