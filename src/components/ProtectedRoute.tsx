'use client'

import { ReactNode, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface ProtectedRouteProps {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, refreshUserFromBackend } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [hasRefreshed, setHasRefreshed] = useState(false)
    const [refreshingUser, setRefreshingUser] = useState(false)

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

            if (user.isOnboarded && window.location.pathname === "/onboarding") {
                router.push("/dashboard")
                return
            }

            if (!user.isOnboarded && window.location.pathname !== "/onboarding") {
                const redirectParams = new URLSearchParams({
                    userId: user.id,
                    from: "quizapp",
                    redirect: `${window.location.origin}/dashboard?onboardingComplete=true`
                })

                const onboardingURL = `${
                    process.env.NEXT_PUBLIC_ONBOARDING_APP_URL
                }/?${redirectParams.toString()}`
                window.location.href = onboardingURL
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

    if (loading || refreshingUser) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Loading...</div>
            </div>
        )
    }

    if (!user) {
        router.push('/login')
        return null
    }

    if (cameFromOnboarding && !hasRefreshed) {
        return null
    }

    if (!user.isOnboarded && window.location.pathname !== "/onboarding") {
        return null
    }

    return <>{children}</>
}