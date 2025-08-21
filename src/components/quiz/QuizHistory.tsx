'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  History, 
  Clock, 
  Trophy, 
  Target, 
  ArrowRight,
  Calendar,
  RefreshCw,
  Play,
  CheckCircle,
  XCircle,
  Brain,
  Zap,
  Flame
} from "lucide-react"

interface QuizSession {
  sessionId: string
  quizId: string
  categoryName: string
  difficulty: string
  status: 'in_progress' | 'completed' | 'abandoned'
  progress: {
    answered: number
    total: number
    percentage: number
  }
  score?: number
  percentage?: number
  totalTime?: number
  startedAt: string
  completedAt?: string
  canResume: boolean
}

interface QuizHistoryProps {
  quizId: string
}

export function QuizHistory({ quizId }: QuizHistoryProps) {
  const [sessions, setSessions] = useState<QuizSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [quizId])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      // Get user ID from localStorage or auth context
      const userId = localStorage.getItem('userId') || 'demo-user'
      
      const response = await fetch(`/api/v1/quiz/sessions/${userId}`)
      const result = await response.json()

      if (result.success) {
        // Filter sessions for this quiz and sort by date
        const filteredSessions = result.data
          .filter((session: QuizSession) => session.quizId === quizId)
          .sort((a: QuizSession, b: QuizSession) => 
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
          )
        setSessions(filteredSessions)
      } else {
        setError(result.error || 'Failed to fetch history')
      }
    } catch (error) {
      console.error('Error fetching history:', error)
      setError('Failed to fetch history')
    } finally {
      setLoading(false)
    }
  }

  const resumeSession = (sessionId: string) => {
    // Redirect to quiz interface with session ID
    window.location.href = `/quiz/${quizId}/session/${sessionId}`
  }

  const reviewSession = (sessionId: string) => {
    // Redirect to review interface
    window.location.href = `/quiz/${quizId}/review/${sessionId}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'hard': return 'text-red-600 bg-red-50 border-red-200'
      case 'mixed': return 'text-purple-600 bg-purple-50 border-purple-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return <Zap className="h-4 w-4" />
      case 'medium': return <Target className="h-4 w-4" />
      case 'hard': return <Flame className="h-4 w-4" />
      case 'mixed': return <Brain className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'abandoned': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Play className="h-4 w-4" />
      case 'abandoned': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
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
          <div className="text-red-600 mb-2">Failed to load history</div>
          <p className="text-gray-600">{error}</p>
          <Button onClick={fetchHistory} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz History</h3>
          <p className="text-gray-600">You haven't attempted this quiz yet. Start your first quiz to see your history here!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <History className="h-5 w-5 mr-2" />
          Quiz History ({sessions.length} attempts)
        </h3>
        <Button 
          onClick={fetchHistory} 
          variant="outline" 
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.sessionId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge className={`${getDifficultyColor(session.difficulty)} border`}>
                      {getDifficultyIcon(session.difficulty)}
                      <span className="ml-1 capitalize">{session.difficulty}</span>
                    </Badge>
                    
                    <Badge className={`${getStatusColor(session.status)} border`}>
                      {getStatusIcon(session.status)}
                      <span className="ml-1 capitalize">{session.status.replace('_', ' ')}</span>
                    </Badge>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(session.startedAt)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Progress */}
                    <div>
                      <div className="text-sm font-medium text-gray-700">Progress</div>
                      <div className="text-sm text-gray-600">
                        {session.progress.answered} / {session.progress.total} questions
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.progress.percentage}% complete
                      </div>
                    </div>

                    {/* Score (if completed) */}
                    {session.status === 'completed' && (
                      <div>
                        <div className="text-sm font-medium text-gray-700">Score</div>
                        <div className="text-lg font-bold text-gray-900 flex items-center">
                          {session.percentage}%
                          {session.percentage! >= 80 && (
                            <Trophy className="h-4 w-4 ml-1 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Time */}
                    <div>
                      <div className="text-sm font-medium text-gray-700">Time</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.totalTime ? formatDuration(session.totalTime) : 'In progress'}
                      </div>
                    </div>
                  </div>

                  {/* Performance indicators for completed quizzes */}
                  {session.status === 'completed' && (
                    <div className="flex space-x-4 text-xs text-gray-500">
                      <span>
                        Score: {session.score ? `${session.score}/100` : 'N/A'}
                      </span>
                      {session.completedAt && (
                        <span>
                          Completed: {formatDate(session.completedAt)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="ml-4 space-y-2">
                  {session.canResume && session.status === 'in_progress' && (
                    <Button 
                      onClick={() => resumeSession(session.sessionId)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  
                  {session.status === 'completed' && (
                    <Button 
                      onClick={() => reviewSession(session.sessionId)}
                      variant="outline"
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}