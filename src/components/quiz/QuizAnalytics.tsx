'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Trophy,
  Brain,
  BarChart3,
  Calendar,
  Award,
  Zap
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

interface AnalyticsData {
  userId: string
  categoryName: string
  totalAttempts: number
  bestScore: number
  averageScore: number
  totalTimeSpent: number
  strengthAreas: string[]
  improvementAreas: string[]
  difficultyPerformance: {
    easy: { attempts: number; successRate: number }
    medium: { attempts: number; successRate: number }
    hard: { attempts: number; successRate: number }
  }
  progressTimeline: {
    date: string
    score: number
    difficulty: string
    timeSpent: number
  }[]
  lastAttemptAt: string
}

interface QuizAnalyticsProps {
  quizId: string
}

export function QuizAnalytics({ quizId }: QuizAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [quizId])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Get user ID from localStorage or auth context
      const userId = localStorage.getItem('userId') || 'demo-user'
      
      const response = await fetch(`/api/v1/quiz/analytics/${userId}`)
      const result = await response.json()

      if (result.success) {
        setAnalyticsData(result.data)
      } else {
        setError(result.error || 'Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-2">Failed to load analytics</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    )
  }

  if (analyticsData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Yet</h3>
          <p className="text-gray-600">Complete some quizzes to see your performance analytics!</p>
        </CardContent>
      </Card>
    )
  }

  // Use the first analytics data (assuming single category for now)
  const analytics = analyticsData[0]

  // Prepare chart data
  const progressData = analytics.progressTimeline.map((entry, index) => ({
    attempt: index + 1,
    score: entry.score,
    date: new Date(entry.date).toLocaleDateString(),
    difficulty: entry.difficulty,
    timeSpent: entry.timeSpent
  }))

  const difficultyData = [
    {
      difficulty: 'Easy',
      attempts: analytics.difficultyPerformance.easy.attempts,
      successRate: analytics.difficultyPerformance.easy.successRate,
      color: '#10B981'
    },
    {
      difficulty: 'Medium',
      attempts: analytics.difficultyPerformance.medium.attempts,
      successRate: analytics.difficultyPerformance.medium.successRate,
      color: '#3B82F6'
    },
    {
      difficulty: 'Hard',
      attempts: analytics.difficultyPerformance.hard.attempts,
      successRate: analytics.difficultyPerformance.hard.successRate,
      color: '#EF4444'
    }
  ]

  const getBadgeLevel = (score: number) => {
    if (score >= 90) return { level: 'Platinum', color: 'bg-purple-100 text-purple-800', icon: Award }
    if (score >= 80) return { level: 'Gold', color: 'bg-yellow-100 text-yellow-800', icon: Trophy }
    if (score >= 70) return { level: 'Silver', color: 'bg-gray-100 text-gray-800', icon: Award }
    return { level: 'Bronze', color: 'bg-orange-100 text-orange-800', icon: Award }
  }

  const badge = getBadgeLevel(analytics.bestScore)
  const BadgeIcon = badge.icon

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.bestScore}%</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            <Badge className={`mt-2 ${badge.color} border-0`}>
              <BadgeIcon className="h-3 w-3 mr-1" />
              {badge.level}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Progress value={analytics.averageScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalAttempts}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round(analytics.totalTimeSpent / 60)} minutes total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(analytics.totalTimeSpent / analytics.totalAttempts / 60)}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Per quiz session</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="attempt" 
                  label={{ value: 'Attempt Number', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'score' ? `${value}%` : value,
                    name === 'score' ? 'Score' : name
                  ]}
                  labelFormatter={(label) => `Attempt ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No progress data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Difficulty Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Performance by Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficulty" />
              <YAxis 
                label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value}%`,
                  'Success Rate'
                ]}
              />
              <Bar 
                dataKey="successRate" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            {difficultyData.map((item) => (
              <div key={item.difficulty} className="text-center">
                <div className="text-sm font-medium text-gray-900">{item.difficulty}</div>
                <div className="text-xs text-gray-600">{item.attempts} attempts</div>
                <div className="text-xs font-medium" style={{ color: item.color }}>
                  {item.successRate}% success
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <Zap className="h-5 w-5 mr-2" />
              Strength Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.strengthAreas.length > 0 ? (
              <div className="space-y-2">
                {analytics.strengthAreas.map((area, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 mr-2 mb-2">
                    {area}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Complete more quizzes to identify your strengths
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <TrendingDown className="h-5 w-5 mr-2" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.improvementAreas.length > 0 ? (
              <div className="space-y-2">
                {analytics.improvementAreas.map((area, index) => (
                  <Badge key={index} className="bg-orange-100 text-orange-800 mr-2 mb-2">
                    {area}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Complete more quizzes to identify improvement areas
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Last Activity */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Last Activity:</span>
              <span className="font-medium">
                {new Date(analytics.lastAttemptAt).toLocaleDateString()}
              </span>
            </div>
            <Badge variant="outline" className="text-blue-600">
              {analytics.categoryName}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}