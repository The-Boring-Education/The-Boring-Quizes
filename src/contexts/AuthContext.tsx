import React, { createContext, useContext, useState, useEffect } from "react"
import { authApi } from "../services/api"
import { config } from "../config"

interface User {
    id: string
    name: string
    email: string
    image?: string
    isOnboarded?: boolean
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signInWithGoogle: () => void
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Check session on mount
    useEffect(() => {
        checkSession()
    }, [])

    const checkSession = async () => {
        try {
            const response = await authApi.getSession()
            if (response.data?.user) {
                setUser(response.data.user)
            }
        } catch (error) {
            console.error("Session check failed:", error)
        } finally {
            setLoading(false)
        }
    }

    const signInWithGoogle = () => {
        // Redirect to TBE webapp Google OAuth endpoint
        window.location.href = `${
            config.API_BASE_URL
        }/api/auth/signin?provider=google&callbackUrl=${encodeURIComponent(
            window.location.origin
        )}`
    }

    const signOut = async () => {
        try {
            await authApi.signOut()
            setUser(null)
            window.location.href = "/"
        } catch (error) {
            console.error("Sign out failed:", error)
        }
    }

    const value = {
        user,
        loading,
        signInWithGoogle,
        signOut
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
