'use client'

import { ReactNode, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { config } from "@/config"

interface ProtectedRouteProps {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, refreshUserFromBackend } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [hasRefreshed, setHasRefreshed] = useState(false)
    const [refreshingUser, setRefreshingUser] = useState(false)
    const [redirectingToOnboarding, setRedirectingToOnboarding] = useState(false)

    const cameFromOnboarding = searchParams.get("onboardingComplete") === "true"

    // 👇 Handle onboarding redirection and refresh logic
    useEffect(() => {
        if (!loading && user) {
            if (cameFromOnboarding && !hasRefreshed) {

                setRefreshingUser(true)

                refreshUserFromBackend?.()
                    .then(() => {
                        console.log("User refreshed.")
                    })
                    .catch((err) => {
                        console.error(" Failed to refresh user:", err)
                    })
                    .finally(() => {
                        setHasRefreshed(true)
                        setRefreshingUser(false)
                    })

                return
            }

            
            if (user.isOnboarded === false) {
                setRedirectingToOnboarding(true)
                
                if (!config.ONBOARDING_APP_URL) {
                    console.error("ONBOARDING_APP_URL is not set in config!")
                    // Fallback: redirect to login or show error
                    router.push('/login')
                    return
                }
                
                const redirectParams = new URLSearchParams({
                    userId: user.id,
                    from: "quizapp",
                    redirect: `${window.location.origin}/dashboard?onboardingComplete=true`
                })

                const onboardingURL = `${config.ONBOARDING_APP_URL}/?${redirectParams.toString()}`
                console.log("Redirecting to:", onboardingURL)
                
                // Use setTimeout to ensure the redirect happens after the current render cycle
                setTimeout(() => {
                    window.location.href = onboardingURL
                }, 100)
                return
            } else if (user.isOnboarded === undefined) {
                console.log("User isOnboarded is undefined, treating as not onboarded")
                // Treat undefined as not onboarded
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
                console.log("Redirecting to:", onboardingURL)
                
                setTimeout(() => {
                    window.location.href = onboardingURL
                }, 100)
                return
            }
        }
    }, [
        user,
        loading,
        hasRefreshed,
        cameFromOnboarding,
        router,
        refreshUserFromBackend
    ])

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

    // Only redirect to login if we're not loading and there's definitely no user
    if (!loading && !user) {
        console.log("No user found and not loading, redirecting to login")
        router.push('/login')
        return null
    }

    // If still loading, show loading state instead of redirecting
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Loading...</div>
            </div>
        )
    }

    // At this point, we should have a user (since we checked !loading && !user above)
    if (!user) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Something went wrong. Please refresh the page.</div>
            </div>
        )
    }

    if (cameFromOnboarding && !hasRefreshed) {
        return null
    }

    if (user.isOnboarded === false || user.isOnboarded === undefined) {
        return null
    }

    return <>{children}</>
}