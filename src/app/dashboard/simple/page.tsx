'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { simpleQuizApi, QuizCategory } from "@/services/simpleQuizApi"
import { Play, BarChart3, Trophy, BookOpen } from "lucide-react"

function SimpleDashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await simpleQuizApi.getCategories()
      if (response.success) {
        setCategories(response.data)
      } else {
        throw new Error(response.error || 'Failed to load categories')
      }
    } catch (err) {
      console.error('Error loading categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = (categoryId: string) => {
    router.push(`/quiz/${categoryId}`)
  }

  const viewPerformance = () => {
    router.push('/performance')
  }

  const viewLeaderboard = () => {
    router.push('/leaderboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadCategories}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Test your knowledge with our quiz collection
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={viewPerformance}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Performance</h3>
                  <p className="text-gray-600 text-sm">View your quiz analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={viewLeaderboard}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Leaderboard</h3>
                  <p className="text-gray-600 text-sm">See top performers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Categories */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Available Quizzes</span>
              </CardTitle>
              <CardDescription>
                Choose a quiz to start testing your knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No quizzes available</p>
                  <Button onClick={loadCategories} variant="outline">
                    Refresh
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <Card
                      key={category._id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                      onClick={() => startQuiz(category._id)}
                    >
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="text-4xl mb-4">
                            {category.categoryIcon}
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            {category.categoryName}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {category.categoryDescription}
                          </p>
                          <Button className="w-full" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Start Quiz
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SimpleDashboard() {
  return (
    <ProtectedRoute>
      <SimpleDashboardContent />
    </ProtectedRoute>
  )
}