'use client'

import { useEffect, useState, Suspense, lazy } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { quizApi, APIError } from "@/services/api"
import { QuizCategory } from "@/types/quiz"
import { QuizCategoryAPI, APIResponse, QuizAttempt } from "@/types/api"
import { User, LogOut, Brain, Trophy, Clock, Target, Menu, X, ChevronDown, Play, ArrowRight, CheckCircle, BookOpen, Zap } from "lucide-react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { formatTimeAgo } from "@/lib/utils"
import Image from "next/image"

// Loading component for better UX
const ComponentLoader = () => (
    <div className='flex items-center justify-center h-32'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
    </div>
)

function DashboardContent() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        data: categoriesData,
        isLoading: categoriesLoading,
        error: categoriesError
    } = useQuery<APIResponse<QuizCategoryAPI[]>>({
        queryKey: ["quiz-categories"],
        queryFn: async () => {
            try {
                return await quizApi.getCategories()
            } catch (error) {
                if (error instanceof APIError) {
                    toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive",
                    })
                }
                throw error
            }
        }
    })

    const {
        data: attemptsData,
        refetch: refetchAttempts,
        isLoading: attemptsLoading
    } = useQuery<APIResponse<QuizAttempt[]>>({
        queryKey: ["quiz-attempts", user?.id],
        queryFn: async () => {
            if (!user?.id) return { success: true, message: "No user", data: [] }
            try {
                return await quizApi.getUserAttempts(user.id)
            } catch (error) {
                if (error instanceof APIError) {
                    toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive",
                    })
                }
                throw error
            }
        },
        enabled: !!user?.id
    })

    const attempts = attemptsData?.data || []

    const totalQuizzes = attempts.length
    const totalTimeSpentSeconds = attempts.reduce((sum: number, attempt: QuizAttempt) => sum + (attempt.timeTaken || 0), 0)
    const totalTimeSpentMinutes = Math.floor(totalTimeSpentSeconds / 60)   
    const averageScore =
  attempts.length > 0
    ? Math.round(
        attempts.reduce((sum: number, attempt: QuizAttempt) => sum + (attempt.score || 0), 0) / attempts.length
      )
    : 0;

    useEffect(() => {
        refetchAttempts();
    }, [refetchAttempts])   
     
    const categories = categoriesData?.data || []

    const handleSelectCategory = (category: QuizCategory) => {
        router.push(`/quiz/${category.id}`)
    }

    const handleSignOut = async () => {
        try {
            setLoading(true)
            await signOut()
            // AuthContext already handles the redirect
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to sign out. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    // Get user initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    // Color mapping for different quiz categories
    const getCategoryColor = (categoryId: string) => {
        const colorMap: Record<string, string> = {
            'javascript-quiz': 'from-yellow-500 to-orange-500',
            'react-js-quiz': 'from-blue-500 to-cyan-500',
            'python-quiz': 'from-green-500 to-emerald-500',
            'web-dev-quiz': 'from-purple-500 to-pink-500',
        }
        return colorMap[categoryId] || 'from-gray-500 to-slate-500'
    }

    // Get user's progress for each category
    const getCategoryProgress = (categoryId: string) => {
        const categoryAttempts = attempts.filter((attempt: QuizAttempt) => 
            attempt.categoryId === categoryId
        )
        
        if (categoryAttempts.length === 0) return null
        
        const bestAttempt = categoryAttempts.reduce((best: QuizAttempt, current: QuizAttempt) => 
            current.score > best.score ? current : best
        )
        
        return {
            attempts: categoryAttempts.length,
            bestScore: bestAttempt.score,
            completed: categoryAttempts.length > 0
        }
    }

    // Map API categories to QuizCategory format
    const transformedCategories: QuizCategory[] = categories.map(
        (cat: QuizCategoryAPI) => ({
            id: cat.categoryId,
            name: cat.categoryName,
            description: cat.categoryDescription,
            icon: cat.categoryIcon,
            questions: [], // Will be loaded when category is selected
            color: getCategoryColor(cat.categoryId)
        })
    )

    return (
        <div className='min-h-screen bg-background'>
            {/* Header */}
            <header className='glass border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex items-center animate-fade-in'>
                            <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3'>
                                <Brain className='w-5 h-5 text-primary-foreground' />
                            </div>
                            <h1 className='text-2xl font-bold text-foreground'>
                                The Boring Quizes
                            </h1>
                        </div>

                        {/* User Menu */}
                        <div className='relative'>
                            <Button
                                variant="outline"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className='flex items-center space-x-3 h-10'
                                disabled={loading}
                            >
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={user?.image} alt={user?.name} />
                                    <AvatarFallback className="text-xs">
                                        {user?.name ? getInitials(user.name) : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <span className='font-medium'>
                                    {user?.name}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>

                            {showUserMenu && (
                                <div className='absolute right-0 mt-2 w-48 glass-dark rounded-lg shadow-lg border z-50'>
                                    <div className='py-2'>
                                        <Button
                                            variant="ghost"
                                            onClick={handleSignOut}
                                            disabled={loading}
                                            className='w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                        >
                                            <LogOut className='w-4 h-4 mr-2' />
                                            {loading ? "Signing out..." : "Sign Out"}
                                        </Button>
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
                <div className='mb-8 animate-fade-in'>
                    <h2 className='text-3xl font-bold text-foreground mb-2'>
                        Welcome back, {user?.name?.split(" ")[0]}! 👋
                    </h2>
                    <p className='text-muted-foreground'>
                        Choose a quiz category to start practicing and improve your skills
                    </p>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                    <Card className='animate-slide-in-left glass'>
                        <CardContent className='p-6'>
                            <div className='flex items-center'>
                                <div className='w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center'>
                                    <Trophy className='w-6 h-6 text-blue-500' />
                                </div>
                                <div className='ml-4'>
                                    <p className='text-sm font-medium text-muted-foreground'>
                                        Total Attempts
                                    </p>
                                    <p className='text-2xl font-bold text-foreground'>
                                        {attemptsLoading ? (
                                            <div className="h-8 w-8 animate-pulse bg-muted rounded" />
                                        ) : (
                                            totalQuizzes
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='animate-slide-in-left glass' style={{ animationDelay: '0.1s' }}>
                        <CardContent className='p-6'>
                            <div className='flex items-center'>
                                <div className='w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center'>
                                    <Target className='w-6 h-6 text-green-500' />
                                </div>
                                <div className='ml-4'>
                                    <p className='text-sm font-medium text-muted-foreground'>
                                        Average Score
                                    </p>
                                    <p className='text-2xl font-bold text-foreground'>
                                        {attemptsLoading ? (
                                            <div className="h-8 w-12 animate-pulse bg-muted rounded" />
                                        ) : (
                                            `${averageScore}%`
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='animate-slide-in-left glass' style={{ animationDelay: '0.2s' }}>
                        <CardContent className='p-6'>
                            <div className='flex items-center'>
                                <div className='w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center'>
                                    <Clock className='w-6 h-6 text-purple-500' />
                                </div>
                                <div className='ml-4'>
                                    <p className='text-sm font-medium text-muted-foreground'>
                                        Time Spent
                                    </p>
                                    <p className='text-2xl font-bold text-foreground'>
                                        {attemptsLoading ? (
                                            <div className="h-8 w-12 animate-pulse bg-muted rounded" />
                                        ) : (
                                            `${totalTimeSpentMinutes}m`
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quiz Categories */}
                <Card className='glass animate-scale-in'>
                    <CardHeader>
                        <CardTitle className='text-lg font-semibold text-foreground'>
                            🎯 Available Quiz Categories
                        </CardTitle>
                        <CardDescription>
                            Select a category to start practicing and test your knowledge
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {categoriesLoading && (
                            <div className='p-8 text-center'>
                                <ComponentLoader />
                                <p className='text-muted-foreground mt-4'>
                                    Loading quiz categories...
                                </p>
                            </div>
                        )}

                        {categoriesError && (
                            <div className='p-8 text-center'>
                                <div className='text-lg font-semibold text-destructive mb-2'>
                                    ⚠️ Failed to load categories
                                </div>
                                <p className='text-muted-foreground'>
                                    Please check your internet connection and try again.
                                </p>
                                <Button 
                                    variant="outline" 
                                    className="mt-4"
                                    onClick={() => window.location.reload()}
                                >
                                    Retry
                                </Button>
                            </div>
                        )}

                        {!categoriesLoading && !categoriesError && (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {transformedCategories.map((category, index) => {
                                    const progress = getCategoryProgress(category.id)
                                    
                                    return (
                                        <Card
                                            key={category.id}
                                            className='group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 border border-gray-300 hover:border-primary/30 animate-fade-in overflow-hidden'
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                            onClick={() => handleSelectCategory(category)}
                                        >
                                            {/* Gradient Header */}
                                            <div className={`h-20 bg-gradient-to-r ${category.color} relative overflow-hidden`}>
                                                <div className="absolute inset-0 bg-black/20"></div>
                                                <div className="absolute top-3 right-3">
                                                    {progress?.completed && (
                                                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1">
                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute bottom-3 left-4">
                                                    <div className="text-3xl">
                                                        {category.icon}
                                                    </div>
                                                </div>
                                            </div>

                                            <CardContent className='p-6 flex flex-col h-full'>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className='text-xl font-bold text-foreground group-hover:text-primary transition-colors'>
                                                        {category.name}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">Quiz</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Progress Indicator */}
                                                {progress && (
                                                    <div className="mb-3 p-2 bg-muted/30 rounded-lg">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-muted-foreground">Best Score</span>
                                                            <span className="font-medium text-primary">{progress.bestScore}%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs mt-1">
                                                            <span className="text-muted-foreground">Attempts</span>
                                                            <span className="font-medium">{progress.attempts}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className='text-sm text-muted-foreground mb-6 flex-1 leading-relaxed'>
                                                    {category.description}
                                                </div>
                                                
                                                <Button 
                                                    className='w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-300 group-hover:scale-105 shadow-lg'
                                                    size="sm"
                                                >
                                                    <Play className="w-4 h-4 mr-2" />
                                                    {progress?.completed ? 'Play Again' : 'Start Quiz'}
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}

                        {!categoriesLoading && !categoriesError && transformedCategories.length === 0 && (
                            <div className='p-8 text-center'>
                                <div className='text-lg font-semibold text-muted-foreground mb-2'>
                                    🤔 No quiz categories available
                                </div>
                                <p className='text-muted-foreground'>
                                    New categories will be added soon. Stay tuned!
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    )
}