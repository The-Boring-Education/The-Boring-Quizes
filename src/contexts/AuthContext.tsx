'use client'

import React, { createContext, useContext, useState, useEffect } from "react"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
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
                        // Use getUserById if we have a userId, otherwise fallback to getUserByEmail
                        let response;
                        if (userData.id) {
                            response = await userApi.getUserById(userData.id) as any;
                        } else {
                            response = await userApi.getUserByEmail(userData.email) as any;
                        }
                        
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Backend verification timeout')), 5000)
                        )
                        
                        const responseWithTimeout = await Promise.race([Promise.resolve(response), timeoutPromise]) as any
                        
                        if (!responseWithTimeout?.data) {
                            if (responseWithTimeout?.status === 404 || responseWithTimeout?.data?.message === 'User not found') {
                                localStorage.removeItem("quizUser")
                                localStorage.removeItem("quizToken")
                                setUser(null)
                            }
                        } else {
                            const backendUserData = responseWithTimeout.data
                            const updatedUser: User = {
                                id: backendUserData._id,
                                name: backendUserData.name,
                                email: backendUserData.email,
                                image: backendUserData.image,
                                isOnboarded: backendUserData.isOnboarded,
                                userName: backendUserData.userName,
                                occupation: backendUserData.occupation,
                                purpose: backendUserData.purpose
                            }
                            setUser(updatedUser)
                            localStorage.setItem("quizUser", JSON.stringify(updatedUser))
                            
                            if (typeof window !== 'undefined') {
                                localStorage.removeItem("quizBackendVerificationFailed")
                            }
                        }
                    } catch (error) {
                        if (error instanceof Error && error.message.includes('Backend verification timeout')) {
                            console.warn("Backend verification timed out, keeping user logged in locally")
                        } else {
                            console.warn("Could not verify user with backend, keeping local auth:", error)
                        }
                        
                        if (typeof window !== 'undefined') {
                            localStorage.setItem("quizBackendVerificationFailed", "true")
                        }
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
            }) as any
            console.log("User response:", userResponse)

            if (userResponse.data) {
                const userData = userResponse.data
                const user: User = {
                    id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    image: userData.image,
                    isOnboarded: userData.isOnboarded, // Use the actual value from backend
                    userName: userData.userName,
                    occupation: userData.occupation,
                    purpose: userData.purpose
                }
                console.log("Setting user in AuthContext:", user)
                setUser(user)
                if (typeof window !== 'undefined') {
                    localStorage.setItem("quizUser", JSON.stringify(user))
                    localStorage.setItem("quizToken", tokenResponse.access_token)
                }

                toast({
                    title: "Welcome!",
                    description: `Successfully signed in as ${user.name}`,
                })

                // Note: Redirect will be handled by the consuming component
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

    // Create Google login hook at the top level
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                await handleGoogleSuccess(tokenResponse)
            } catch (error) {
                console.error("Login success handler failed:", error)
                toast({
                    title: "Sign in failed",
                    description: "Something went wrong during sign in. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        },
        onError: (error) => {
            console.error("Login Failed:", error)
            toast({
                title: "Sign in failed",
                description: "Google login failed. Please try again.",
                variant: "destructive",
            })
            setLoading(false)
        }
    })

    const signInWithGoogle = async () => {
        try {
            setLoading(true)
            googleLogin()
            // Note: Loading state will be reset in the success/error callbacks
        } catch (error) {
            console.error("Error initiating Google login:", error)
            setLoading(false)
            throw error
        }
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
          // Use getUserById if we have a userId, otherwise fallback to getUserByEmail
          let response;
          if (user?.id) {
              response = await userApi.getUserById(user.id) as any;
          } else {
              response = await userApi.getUserByEmail(user?.email || "") as any;
          }
          
          // Check if response has the expected structure
          // The actual structure is: {status: true, data: {...}}
          console.log("refreshUserFromBackend response:", response);
          console.log("response.data:", response?.data);
          
          if (!response?.data) {
              console.error("Invalid response structure from backend:", response);
              throw new Error("Invalid response structure from backend");
          }
          
          const data = response.data;
      
          const updatedUser: User = {
            id: data._id,
            name: data.name,
            email: data.email,
            image: data.image,
            isOnboarded: data.isOnboarded,
            userName: data.userName,
            occupation: data.occupation,
            purpose: data.purpose,
          };
            
          setUser(updatedUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem("quizUser", JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error("Failed to refresh user from backend:", error);
          throw error; // Re-throw to let the caller handle it
        }
      };

    // Retry backend verification if it failed initially
    const retryBackendVerification = async () => {
        if (typeof window !== 'undefined' && localStorage.getItem("quizBackendVerificationFailed")) {
            try {
                await refreshUserFromBackend()
            } catch (error) {
                console.warn("Backend verification retry failed:", error)
            }
        }
    }

    const value = {
        user,
        loading,
        signInWithGoogle,
        signOut,
        updateUser,
        refreshUserFromBackend,
        retryBackendVerification,
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