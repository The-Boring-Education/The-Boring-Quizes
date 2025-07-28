import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { userApi } from "../../services/api"
import StepUsername from "./StepUsername"
import StepOccupation from "./StepOccupation"
import StepPurpose from "./StepPurpose"
import { Brain, ArrowLeft, ArrowRight } from "lucide-react"

interface OnboardingProps {
    onComplete: () => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    const { user, updateUser } = useAuth()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const [form, setForm] = useState({
        userName: "",
        occupation: "",
        purpose: [] as string[]
    })

    const [isUsernameValid, setIsUsernameValid] = useState(false)

    const steps = [
        {
            component: (
                <StepUsername
                    userName={form.userName}
                    onUpdate={(userName, isValid) => {
                        setForm({ ...form, userName })
                        setIsUsernameValid(isValid)
                    }}
                />
            ),
            isValid: () => isUsernameValid
        },
        {
            component: (
                <StepOccupation
                    occupation={form.occupation}
                    onUpdate={(occupation) => setForm({ ...form, occupation })}
                />
            ),
            isValid: () => form.occupation.length > 0
        },
        {
            component: (
                <StepPurpose
                    purpose={form.purpose}
                    onUpdate={(purpose) => setForm({ ...form, purpose })}
                />
            ),
            isValid: () => form.purpose.length > 0
        }
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        if (!user?.id || isSubmitting) return

        setIsSubmitting(true)
        setError("")

        try {
            const response = await userApi.onboardUser(user.id, {
                userName: form.userName,
                occupation: form.occupation,
                purpose: form.purpose
            })

            if (response.data?.data) {
                updateUser({ isOnboarded: true, ...form })
                onComplete()
            }
        } catch (error) {
            setError("Failed to complete onboarding. Please try again.")
            console.error("Onboarding error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isCurrentStepValid = steps[currentStep].isValid()
    const isLastStep = currentStep === steps.length - 1

    return (
        <div className='min-h-screen bg-white flex items-center justify-center p-4'>
            <div className='max-w-lg w-full'>
                {/* Logo */}
                <div className='text-center mb-8'>
                    <div className='w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Brain className='w-8 h-8 text-white' />
                    </div>
                    <h1 className='text-3xl font-black'>Welcome to Quizes!</h1>
                    <p className='text-gray-600 mt-2'>Let's get you set up</p>
                </div>

                {/* Progress bar */}
                <div className='mb-8'>
                    <div className='flex justify-between mb-2'>
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`flex-1 h-2 mx-1 rounded-full transition-colors ${
                                    index <= currentStep
                                        ? "bg-black"
                                        : "bg-gray-200"
                                }`}
                            />
                        ))}
                    </div>
                    <p className='text-sm text-gray-600 text-center'>
                        Step {currentStep + 1} of {steps.length}
                    </p>
                </div>

                {/* Current step */}
                <div className='bg-white rounded-2xl shadow-xl p-8 mb-6'>
                    {steps[currentStep].component}
                </div>

                {/* Error message */}
                {error && (
                    <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm'>
                        {error}
                    </div>
                )}

                {/* Navigation */}
                <div className='flex justify-between'>
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                            currentStep === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}>
                        <ArrowLeft className='w-4 h-4' />
                        <span>Back</span>
                    </button>

                    {isLastStep ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!isCurrentStepValid || isSubmitting}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                                !isCurrentStepValid || isSubmitting
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-black hover:bg-gray-800 text-white"
                            }`}>
                            <span>
                                {isSubmitting
                                    ? "Completing..."
                                    : "Complete Setup"}
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!isCurrentStepValid}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                                !isCurrentStepValid
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-black hover:bg-gray-800 text-white"
                            }`}>
                            <span>Next</span>
                            <ArrowRight className='w-4 h-4' />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
