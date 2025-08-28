'use client'

import { ReactNode, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { config } from "@/config"

interface ProtectedRouteProps {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, refreshUserFromBackend, checkAuth, retryBackendVerification } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [hasRefreshed, setHasRefreshed] = useState(false)
    const [refreshingUser, setRefreshingUser] = useState(false)
    const [redirectingToOnboarding, setRedirectingToOnboarding] = useState(false)
    const [authChecked, setAuthChecked] = useState(false)
    const [isProcessingOnboarding, setIsProcessingOnboarding] = useState(false);

    const cameFromOnboarding = searchParams.get("onboardingComplete") === "true"

    // Handle onboarding redirection and refresh logic
    useEffect(() => {
        if (!loading && user) {
            if (cameFromOnboarding && !hasRefreshed) {
                setRefreshingUser(true)

                // Force refresh user data from backend
                const refreshUserData = async () => {
                    if (isProcessingOnboarding) return; // Prevent multiple simultaneous calls
                    
                    setIsProcessingOnboarding(true);
                    try {
                        await refreshUserFromBackend?.()
                        console.log("User data refreshed after onboarding")
                    } catch (err) {
                        console.error("Failed to refresh user after onboarding:", err)
                        // Try to refresh auth as fallback
                        try {
                            await checkAuth()
                            console.log("Fallback auth refresh completed")
                        } catch (fallbackErr) {
                            console.error("Fallback auth refresh also failed:", fallbackErr)
                            // Even if both fail, mark as refreshed to prevent infinite loop
                            // The user will stay logged in with their current data
                        }
                    } finally {
                        setHasRefreshed(true)
                        setRefreshingUser(false)
                        setIsProcessingOnboarding(false)
                    }
                }

                refreshUserData()
                return
            }

            // Check if user is onboarded after refresh
            if (user.isOnboarded === false || user.isOnboarded === undefined) {
                // Only redirect if we haven't just come from onboarding
                if (!cameFromOnboarding) {
                    setRedirectingToOnboarding(true)
                    
                    if (!config.ONBOARDING_APP_URL) {
                        console.error("ONBOARDING_APP_URL is not set in config!")
                        router.push('/login')
                        return
                    }
                    
                    const redirectParams = new URLSearchParams({
                        userId: user.id,
                        from: "quizapp",
                        redirect: `${window.location.origin}/dashboard?onboardingComplete=true`
                    })

                    const onboardingURL = `${config.ONBOARDING_APP_URL}/?${redirectParams.toString()}`
                    
                    setTimeout(() => {
                        window.location.href = onboardingURL
                    }, 100)
                    return
                }
            }
        }
    }, [
        user,
        loading,
        hasRefreshed,
        cameFromOnboarding,
        router,
        isProcessingOnboarding
    ])

    // Enhanced authentication check with better timing
    useEffect(() => {
        if (loading) {
            return
        }

        if (user) {
            setAuthChecked(true)
            return
        }

        if (!user && !loading && !authChecked) {
            const refreshAuth = async () => {
                try {
                    await checkAuth()
                    
                    if (!user) {
                        await retryBackendVerification()
                        
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                } catch (error) {
                    console.error("Failed to refresh auth:", error)
                }
            }
            
            refreshAuth()
            
            const timer = setTimeout(() => {
                if (!user) {
                    router.push('/login')
                }
            }, 2000)
            
            return () => clearTimeout(timer)
        }
    }, [loading, user, router, checkAuth, authChecked, retryBackendVerification])

    // Show loading state while any of these are happening
    if (loading || refreshingUser || redirectingToOnboarding) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>
                    {redirectingToOnboarding ? 'Redirecting to onboarding...' : 'Loading...'}
                </div>
            </div>
        )
    }

    // If no user after loading and auth check, show loading while redirecting
    if (!user && authChecked) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Redirecting to login...</div>
            </div>
        )
    }

    if (cameFromOnboarding && !hasRefreshed) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Refreshing user data...</div>
            </div>
        )
    }

    if (user && (user.isOnboarded === false || user.isOnboarded === undefined)) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Redirecting to onboarding...</div>
            </div>
        )
    }

    return <>{children}</>
}