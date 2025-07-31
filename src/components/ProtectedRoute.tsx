import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Loading...</div>
            </div>
        )
    }

    // If no user, redirect to login
    if (!user) {
        return <Navigate to='/login' replace />
    }

    // If user exists but not onboarded, redirect to onboarding
    if (user && !user.isOnboarded) {
        return <Navigate to='/onboarding' replace />
    }

    // User is authenticated and onboarded, render the protected component
    return <>{children}</>
}
