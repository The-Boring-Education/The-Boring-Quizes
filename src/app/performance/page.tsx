'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { simpleQuizApi, UserPerformance } from "@/services/simpleQuizApi"
import { 
  ArrowLeft, 
  BarChart3, 
  Trophy, 
  Clock, 
  Target,
  TrendingUp,
  Calendar
} from "lucide-react"

function PerformanceContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [performance, setPerformance] = useState<UserPerformance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadPerformance()
    }
  }, [user?.id])

  const loadPerformance = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)
      const response = await simpleQuizApi.getUserPerformance(user.id)
      if (response.success) {
        setPerformance(response.data)
      } else {
        throw new Error(response.error || 'Failed to load performance')
      }
    } catch (err) {
      console.error('Error loading performance:', err)
      setError(err instanceof Error ? err.message : 'Failed to load performance')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading performance...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadPerformance}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!performance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No performance data available</p>
          <Button onClick={() => router.push('/dashboard/simple')}>
            Take Your First Quiz
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/simple')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Your Performance</h1>
            <p className="text-gray-600">Track your learning progress</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                    <p className="text-2xl font-bold text-gray-900">{performance.totalAttempts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{performance.averageScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Best Score</p>
                    <p className="text-2xl font-bold text-gray-900">{performance.bestScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Time Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatTime(performance.totalTimeSpent)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Performance by Category</span>
                </CardTitle>
                <CardDescription>
                  See how you're performing across different quiz categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performance.categoryBreakdown.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No category data available yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {performance.categoryBreakdown.map((category, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{category.categoryName}</h4>
                          <span className="text-sm font-semibold text-blue-600">
                            {category.averageScore}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{category.attempts} attempts</span>
                          <span>Best: {category.bestScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${category.averageScore}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest quiz attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performance.recentAttempts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-4">
                    {performance.recentAttempts.map((attempt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {attempt.categoryName}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {formatDate(attempt.completedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            attempt.score >= 80 ? 'text-green-600' :
                            attempt.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {attempt.score}%
                          </div>
                          <p className="text-xs text-gray-600">
                            {formatTime(attempt.totalTimeSpent)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button onClick={() => router.push('/dashboard/simple')}>
              Take Another Quiz
            </Button>
            <Button variant="outline" onClick={() => router.push('/leaderboard')}>
              View Leaderboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Performance() {
  return (
    <ProtectedRoute>
      <PerformanceContent />
    </ProtectedRoute>
  )
}