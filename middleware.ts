import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the hostname (e.g., brewhaus.com.au)
  const hostname = request.headers.get('host') || ''
  
  // Remove www and port if present
  const domain = hostname.replace('www.', '').split(':')[0]
  
  // Skip localhost
  if (domain === 'localhost' || domain === '127.0.0.1') {
    return NextResponse.next()
  }
  
  // For production domains, rewrite to the [domain] route
  // This allows the domain to work without the path
  const url = request.nextUrl.clone()
  
  // Only rewrite the root path
  if (url.pathname === '/') {
    url.pathname = `/${domain}`
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

// Run middleware on all paths
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}