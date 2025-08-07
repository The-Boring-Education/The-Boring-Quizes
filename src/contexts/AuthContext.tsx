'use client'

import React, { createContext, useContext, useState, useEffect } from "react"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"
import { userApi, APIError } from "@/services/api"
import { User, GoogleUserInfo, AuthContextType } from "@/types/auth"
import { useToast } from "@/components/ui/use-toast"

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
    const router = useRouter()
    const { toast } = useToast()

    // Check authentication status on mount
    const checkAuth = async () => {
        try {
            setLoading(true)
            
            if (typeof window !== 'undefined') {
                const storedUser = localStorage.getItem("quizUser")
                if (storedUser) {
                    const userData = JSON.parse(storedUser)
                    setUser(userData)
                    
                    // Verify user still exists in backend
                    try {
                        const response = await userApi.getUserByEmail(userData.email)
                        if (!response?.data?.data) {
                            // User doesn't exist in backend, clear local data
                            localStorage.removeItem("quizUser")
                            localStorage.removeItem("quizToken")
                            setUser(null)
                        }
                    } catch (error) {
                        // If verification fails, keep user logged in locally
                        console.warn("Could not verify user with backend:", error)
                    }
                }
            }
        } catch (error) {
            console.error("Error checking auth:", error)
            if (typeof window !== 'undefined') {
                localStorage.removeItem("quizUser")
                localStorage.removeItem("quizToken")
            }
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const handleGoogleSuccess = async (tokenResponse: {
        access_token: string
    }) => {
        try {
            setLoading(true)
            
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
                if (typeof window !== 'undefined') {
                    localStorage.setItem("quizUser", JSON.stringify(user))
                    localStorage.setItem("quizToken", tokenResponse.access_token)
                }

                toast({
                    title: "Welcome!",
                    description: `Successfully signed in as ${user.name}`,
                })

                // Redirect to dashboard if user is onboarded
                if (user.isOnboarded) {
                    router.push("/dashboard")
                }
            }
        } catch (error) {
            console.error("Google sign in failed:", error)
            toast({
                title: "Sign in failed",
                description: error instanceof APIError ? error.message : "Something went wrong",
                variant: "destructive",
            })
            throw error
        } finally {
            setLoading(false)
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
                if (typeof window !== 'undefined') {
                    const storedUser = localStorage.getItem("quizUser")
                    if (storedUser) {
                        clearInterval(checkForUser)
                        resolve()
                    }
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
        try {
            setUser(null)
            if (typeof window !== 'undefined') {
                localStorage.removeItem("quizUser")
                localStorage.removeItem("quizToken")
            }
            
            toast({
                title: "Signed out",
                description: "You have been successfully signed out",
            })
            
            router.push("/")
        } catch (error) {
            console.error("Error signing out:", error)
            toast({
                title: "Sign out failed",
                description: "Something went wrong while signing out",
                variant: "destructive",
            })
        }
    }

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates }
            setUser(updatedUser)
            if (typeof window !== 'undefined') {
                localStorage.setItem("quizUser", JSON.stringify(updatedUser))
            }
        }
    }

    const refreshUserFromBackend = async () => {
        try {
          const response = await userApi.getUserByEmail(user?.email || "");
          const data = response.data.data;
      
          const updatedUser: User = {
            id: data._id,
            name: data.name,
            email: data.email,
            image: data.image,
            isOnboarded: data.isOnboarded || false,
            userName: data.userName,
            occupation: data.occupation,
            purpose: data.purpose,
          };
            
          setUser(updatedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem("quizUser", JSON.stringify(updatedUser));
          }
        } catch (error) {
        }
      };

    const value = {
        user,
        loading,
        signInWithGoogle,
        signOut,
        updateUser,
        refreshUserFromBackend,
        checkAuth
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!googleClientId) {
        console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined")
        return <div>Google Client ID not configured</div>
    }

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <AuthProviderInner>{children}</AuthProviderInner>
        </GoogleOAuthProvider>
    )
}