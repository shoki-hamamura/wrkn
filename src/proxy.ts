import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''} https://vercel.live https://*.vercel.com https://*.vercel.sh https://va.vercel-scripts.com https://vercel-insights.com https://cdn.vercel-insights.com;
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data: https://vercel.live https://*.vercel.com https://cdn.vercel-insights.com;
    font-src 'self' data: https://vercel.live;
    connect-src 'self' https://vercel.live https://*.vercel-insights.com https://vitals.vercel-insights.com wss://*.vercel.com;
    frame-src 'self' https://vercel.live;
    frame-ancestors 'self';
    form-action 'self';
    base-uri 'self';
    object-src 'none';
  `

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue,
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue,
  )
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  )

  return response
}

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.json).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
