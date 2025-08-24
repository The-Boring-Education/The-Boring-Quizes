import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes that require authentication
  const protectedRoutes = ['/dashboard', '/performance', '/leaderboard', '/quiz']
  const publicRoutes = ['/login', '/']

  // Check if the current path requires protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)

  // Get user data from cookies or headers (you might need to adjust this based on your auth implementation)
  const userCookie = request.cookies.get('quizUser')?.value
  
  let user = null
  try {
    user = userCookie ? JSON.parse(userCookie) : null
  } catch {
    // Invalid user cookie, treat as not authenticated
  }

  // If accessing a protected route without authentication
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If accessing login page while already authenticated
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If accessing root while authenticated, redirect to dashboard
  if (pathname === '/' && user) {
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