import { ReactNode, useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, refreshUserFromBackend } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const [hasRefreshed, setHasRefreshed] = useState(false)
    const [refreshingUser, setRefreshingUser] = useState(false)

    const params = new URLSearchParams(location.search)
    const cameFromOnboarding = params.get("onboardingComplete") === "true"

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

            if (user.isOnboarded && location.pathname === "/onboarding") {
                navigate("/dashboard", { replace: true })
                return
            }

            if (!user.isOnboarded && location.pathname !== "/onboarding") {
                const redirectParams = new URLSearchParams({
                    userId: user.id,
                    from: "quizapp",
                    redirect: `${window.location.origin}/dashboard?onboardingComplete=true`
                })

                const onboardingURL = `${
                    import.meta.env.VITE_ONBOARDING_APP_URL
                }/?${redirectParams.toString()}`
                window.location.href = onboardingURL
                return
            }
        }
    }, [
        user,
        loading,
        location.pathname,
        hasRefreshed,
        cameFromOnboarding,
        navigate
    ])

    if (loading || refreshingUser) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Loading...</div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to='/login' replace />
    }

    if (cameFromOnboarding && !hasRefreshed) {
        return null
    }

    if (!user.isOnboarded && location.pathname !== "/onboarding") {
        return null
    }

    return <>{children}</>
}
