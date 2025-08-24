'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ClientAuthProps {
  children: React.ReactNode
}

export function ClientAuth({ children }: ClientAuthProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const protectedRoutes = ['/dashboard', '/performance', '/leaderboard', '/quiz']
  const publicRoutes = ['/login', '/']
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (loading) return // Wait for auth check to complete

    // If accessing a protected route without authentication
    if (isProtectedRoute && !user) {
      router.replace('/login')
      return
    }

    // If accessing login page while already authenticated
    if (pathname === '/login' && user) {
      router.replace('/dashboard')
      return
    }

    // If accessing root while authenticated, redirect to dashboard
    if (pathname === '/' && user) {
      router.replace('/dashboard')
      return
    }
  }, [user, loading, pathname, router, isProtectedRoute])

  // Show loading spinner during auth check for protected routes
  if (loading && isProtectedRoute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render protected content if not authenticated
  if (!loading && isProtectedRoute && !user) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}