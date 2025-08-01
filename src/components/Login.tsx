import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Brain } from "lucide-react"

export default function Login() {
    const { signInWithGoogle, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            if (user.isOnboarded) {
                navigate("/dashboard", { replace: true });
            } else {
                const params = new URLSearchParams({
                    userId: user.id,
                    from: "quizapp",
                    redirect: window.location.origin + "/dashboard?onboardingComplete=true",
                });
    
                window.location.href = `${import.meta.env.VITE_ONBAORDING_APP_URL}/?${params.toString()}`;
            }
        }
    }, [user, navigate]);
    

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle()
            // Navigation will be handled by the useEffect above
        } catch (error) {
            console.error("Login failed:", error)
        }
    }

    return (
        <div className='min-h-screen bg-white flex items-center justify-center p-4'>
            <div className='max-w-md w-full'>
                <div className='text-center mb-8'>
                    <div className='w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6'>
                        <Brain className='w-10 h-10 text-white' />
                    </div>
                    <h1 className='text-4xl font-black mb-2'>
                        Welcome to Quizes
                    </h1>
                    <p className='text-gray-600'>by The Boring Education</p>
                </div>

                <div className='bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100'>
                    <h2 className='text-2xl font-bold text-center mb-6'>
                        Sign In to Continue
                    </h2>

                    <button
                        onClick={handleGoogleSignIn}
                        className='w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200'>
                        <svg className='w-5 h-5' viewBox='0 0 24 24'>
                            <path
                                fill='#4285F4'
                                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                            />
                            <path
                                fill='#34A853'
                                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                            />
                            <path
                                fill='#FBBC05'
                                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                            />
                            <path
                                fill='#EA4335'
                                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                            />
                            <path fill='none' d='M1 1h22v22H1z' />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    <div className='mt-6 text-center text-sm text-gray-600'>
                        <p>By signing in, you agree to our</p>
                        <p className='mt-1'>
                            <a href='#' className='text-black hover:underline'>
                                Terms of Service
                            </a>
                            {" & "}
                            <a href='#' className='text-black hover:underline'>
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>

                <div className='mt-8 text-center text-gray-600'>
                    <p className='text-sm'>
                        Join thousands of learners improving their skills
                    </p>
                </div>
            </div>
        </div>
    )
}
