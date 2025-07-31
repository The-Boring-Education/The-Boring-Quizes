import React, { createContext, useContext, useState, useEffect } from "react"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import { userApi } from "../services/api"
import { config } from "../config"
import { User, GoogleUserInfo, AuthContextType } from "../types/auth"

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
        access_token: string
    }) => {
        try {
            // Use access token to fetch user info from Google
            const response = await fetch(
                `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`
            )

            if (!response.ok) {
                throw new Error("Failed to fetch user info from Google")
            }

            const googleUserInfo: GoogleUserInfo = await response.json()

            // Create or find user in TBE webapp
            const userResponse = await userApi.createOrFindUser({
                name: googleUserInfo.name,
                email: googleUserInfo.email,
                image: googleUserInfo.picture,
                provider: "google",
                providerAccountId: googleUserInfo.sub
            })

            if (userResponse.data?.data) {
                const userData = userResponse.data.data
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
                localStorage.setItem("quizToken", tokenResponse.access_token)
            }
        } catch (error) {
            console.error("Google sign in failed:", error)
            throw error
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: (error) => {
            console.error("Login Failed:", error)
            throw new Error("Google login failed")
        }
    })

    const signInWithGoogle = () => {
        return new Promise<void>((resolve, reject) => {
            googleLogin()
            // The actual success/error handling is done in the callbacks above
            // This is a bit of a hack, but useGoogleLogin doesn't return a promise
            const checkForUser = setInterval(() => {
                const storedUser = localStorage.getItem("quizUser")
                if (storedUser) {
                    clearInterval(checkForUser)
                    resolve()
                }
            }, 100)

            // Timeout after 30 seconds
            setTimeout(() => {
                clearInterval(checkForUser)
                reject(new Error("Login timeout"))
            }, 30000)
        })
    }

    const signOut = async () => {
        setUser(null)
        localStorage.removeItem("quizUser")
        localStorage.removeItem("quizToken")
        // Don't redirect here, let the ProtectedRoute handle it
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
