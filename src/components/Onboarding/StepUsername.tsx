import { useState, useEffect } from "react"
import { userApi } from "../../services/api"
import { AxiosError } from "axios"

interface StepUsernameProps {
    userName: string
    onUpdate: (userName: string, isValid: boolean) => void
}

export default function StepUsername({
    userName,
    onUpdate
}: StepUsernameProps) {
    const [isChecking, setIsChecking] = useState(false)
    const [isAvailable, setIsAvailable] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const checkUsername = async () => {
            if (userName.length < 3) {
                setError("Username must be at least 3 characters")
                onUpdate(userName, false)
                return
            }

            setIsChecking(true)
            setError("")

            try {
                const response = await userApi.checkUsername(userName)
                if (response.data?.data) {
                    setIsAvailable(false)
                    setError("Username already taken")
                    onUpdate(userName, false)
                } else {
                    setIsAvailable(true)
                    onUpdate(userName, true)
                }
            } catch (error) {
                if (
                    error instanceof AxiosError &&
                    error.response?.status === 404
                ) {
                    setIsAvailable(true)
                    onUpdate(userName, true)
                } else {
                    setError("Error checking username")
                    onUpdate(userName, false)
                }
            } finally {
                setIsChecking(false)
            }
        }

        const timer = setTimeout(checkUsername, 500)
        return () => clearTimeout(timer)
    }, [userName, onUpdate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
        onUpdate(value, false)
    }

    return (
        <div className='space-y-4'>
            <div>
                <h2 className='text-2xl font-bold mb-2'>
                    Choose your username
                </h2>
                <p className='text-gray-600'>
                    This will be your unique identifier on the platform
                </p>
            </div>

            <div>
                <input
                    type='text'
                    value={userName}
                    onChange={handleChange}
                    placeholder='Enter username'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none text-lg'
                />

                {isChecking && (
                    <p className='mt-2 text-sm text-gray-500'>
                        Checking availability...
                    </p>
                )}

                {!isChecking && error && (
                    <p className='mt-2 text-sm text-red-600'>{error}</p>
                )}

                {!isChecking && isAvailable && userName.length >= 3 && (
                    <p className='mt-2 text-sm text-green-600'>
                        Username is available!
                    </p>
                )}
            </div>

            <div className='text-sm text-gray-500'>
                <p>• Use lowercase letters, numbers, and underscores only</p>
                <p>• Must be at least 3 characters long</p>
            </div>
        </div>
    )
}
