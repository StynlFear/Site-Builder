import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = ['/dashboard', '/chat', '/preview']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Get the token from cookies
  const token = request.cookies.get('authToken')?.value
  
  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If it's an auth route and user is already logged in, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
