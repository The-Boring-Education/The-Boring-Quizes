import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import { quizApi } from "../services/api"
import { QuizCategory } from "../types/quiz"
import { QuizCategoryAPI } from "../types/api"
import { User, LogOut, Brain, Trophy, Clock, Target } from "lucide-react"

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [showUserMenu, setShowUserMenu] = useState(false)

    const {
        data: categoriesData,
        isLoading,
        error
    } = useQuery({
        queryKey: ["quiz-categories"],
        queryFn: () => quizApi.getCategories()
    })

    const categories = categoriesData?.data?.data || []

    const handleSelectCategory = (category: QuizCategory) => {
        navigate(`/quiz/${category.id}`)
    }

    const handleSignOut = async () => {
        await signOut()
        navigate("/")
    }

    // Map API categories to QuizCategory format
    const transformedCategories: QuizCategory[] = categories.map(
        (cat: QuizCategoryAPI) => ({
            id: cat.categoryId,
            name: cat.categoryName,
            description: cat.categoryDescription,
            icon: cat.categoryIcon,
            questions: [], // Will be loaded when category is selected
            color: "blue" // Default color
        })
    )

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex items-center'>
                            <div className='w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3'>
                                <Brain className='w-5 h-5 text-white' />
                            </div>
                            <h1 className='text-2xl font-bold'>Quizes</h1>
                        </div>

                        {/* User Menu */}
                        <div className='relative'>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className='flex items-center space-x-3 bg-white border-2 border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors'>
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className='w-6 h-6 rounded-full'
                                    />
                                ) : (
                                    <User className='w-5 h-5' />
                                )}
                                <span className='font-medium'>
                                    {user?.name}
                                </span>
                            </button>

                            {showUserMenu && (
                                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
                                    <div className='py-2'>
                                        <button
                                            onClick={handleSignOut}
                                            className='w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 text-red-600'>
                                            <LogOut className='w-4 h-4' />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Welcome Section */}
                <div className='mb-8'>
                    <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                        Welcome back, {user?.name?.split(" ")[0]}!
                    </h2>
                    <p className='text-gray-600'>
                        Choose a quiz category to start practicing
                    </p>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                    <div className='bg-white rounded-lg shadow p-6 border border-gray-200'>
                        <div className='flex items-center'>
                            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                <Trophy className='w-6 h-6 text-blue-600' />
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-gray-600'>
                                    Total Quizzes
                                </p>
                                <p className='text-2xl font-bold text-gray-900'>
                                    0
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow p-6 border border-gray-200'>
                        <div className='flex items-center'>
                            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                                <Target className='w-6 h-6 text-green-600' />
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-gray-600'>
                                    Average Score
                                </p>
                                <p className='text-2xl font-bold text-gray-900'>
                                    0%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow p-6 border border-gray-200'>
                        <div className='flex items-center'>
                            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                                <Clock className='w-6 h-6 text-purple-600' />
                            </div>
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-gray-600'>
                                    Time Spent
                                </p>
                                <p className='text-2xl font-bold text-gray-900'>
                                    0m
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quiz Categories */}
                <div className='bg-white rounded-lg shadow border border-gray-200'>
                    <div className='px-6 py-4 border-b border-gray-200'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                            Available Quizzes
                        </h3>
                    </div>

                    {isLoading && (
                        <div className='p-8 text-center'>
                            <div className='text-lg font-semibold'>
                                Loading categories...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className='p-8 text-center'>
                            <div className='text-lg font-semibold text-red-600'>
                                Failed to load categories. Please try again.
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className='p-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {transformedCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() =>
                                            handleSelectCategory(category)
                                        }
                                        className='cursor-pointer rounded-xl border-2 p-6 shadow transition-all duration-150 flex flex-col items-start justify-between h-full border-black bg-white hover:bg-red-50 hover:border-red-600'>
                                        <div className='text-xl font-bold mb-2'>
                                            {category.name}
                                        </div>
                                        <div className='text-sm text-gray-700 mb-4 flex-1'>
                                            {category.description}
                                        </div>
                                        <div className='w-full'>
                                            <button className='w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors'>
                                                Start Quiz
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
