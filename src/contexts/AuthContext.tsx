import React, { createContext, useContext, useState, useEffect } from "react"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { userApi } from "../services/api"
import { config } from "../config"

interface User {
    id: string
    name: string
    email: string
    image?: string
    isOnboarded?: boolean
    userName?: string
    occupation?: string
    purpose?: string[]
}

interface GoogleUserInfo {
    sub: string
    name: string
    email: string
    picture: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signInWithGoogle: () => void
    signOut: () => Promise<void>
    updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

const AuthProviderInner: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Check for stored user on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("quizUser")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const handleGoogleSuccess = async (tokenResponse: {
        credential?: string
        access_token?: string
        id_token?: string
    }) => {
        try {
            // Decode the ID token to get user info
            const token = tokenResponse.credential || tokenResponse.id_token
            if (!token) {
                throw new Error("No token received")
            }
            const decoded = jwtDecode<GoogleUserInfo>(token)

            // Create or find user in TBE webapp
            const response = await userApi.createOrFindUser({
                name: decoded.name,
                email: decoded.email,
                image: decoded.picture,
                provider: "google",
                providerAccountId: decoded.sub
            })

            if (response.data?.data) {
                const userData = response.data.data
                const user: User = {
                    id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    image: userData.image,
                    isOnboarded: userData.isOnboarded || false,
                    userName: userData.userName,
                    occupation: userData.occupation,
                    purpose: userData.purpose
                }
                setUser(user)
                localStorage.setItem("quizUser", JSON.stringify(user))
                localStorage.setItem(
                    "quizToken",
                    tokenResponse.access_token || tokenResponse.credential || ""
                )
            }
        } catch (error) {
            console.error("Google sign in failed:", error)
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: (error) => console.error("Login Failed:", error)
    })

    const signInWithGoogle = () => {
        googleLogin()
    }

    const signOut = async () => {
        setUser(null)
        localStorage.removeItem("quizUser")
        localStorage.removeItem("quizToken")
        window.location.href = "/"
    }

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates }
            setUser(updatedUser)
            localStorage.setItem("quizUser", JSON.stringify(updatedUser))
        }
    }

    const value = {
        user,
        loading,
        signInWithGoogle,
        signOut,
        updateUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    return (
        <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
            <AuthProviderInner>{children}</AuthProviderInner>
        </GoogleOAuthProvider>
    )
}
