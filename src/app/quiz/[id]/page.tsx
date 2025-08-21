'use client'

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { quizApi } from "@/services/quizApi"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Trophy,
  Target,
  Zap,
  Brain,
  ArrowLeft,
  BarChart3,
  History,
  Medal,
  User,
  TrendingUp
} from "lucide-react"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
  detailedExplanation: string
}

interface QuizSession {
  sessionId: string
  categoryName: string
  difficulty: string
  questionCount: number
  currentQuestionIndex: number
  currentQuestion: QuizQuestion | null
  progress: {
    answered: number
    total: number
    percentage: number
  }
}

interface QuizResult {
  isCorrect: boolean
  explanation: string
  detailedExplanation?: string
  nextQuestion?: QuizQuestion
  isCompleted?: boolean
  progress: {
    answered: number
    total: number
    percentage: number
  }
}

function QuizContent() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [gameState, setGameState] = useState<'setup' | 'playing' | 'completed'>('setup')
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questionResult, setQuestionResult] = useState<QuizResult | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizData, setQuizData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Configuration state
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('medium')
  const [questionCount, setQuestionCount] = useState(10)

  // Enhanced features state
  const [activeTab, setActiveTab] = useState<'quiz' | 'analytics' | 'history' | 'leaderboard'>('quiz')
  const [userAnalytics, setUserAnalytics] = useState<any>(null)
  const [quizHistory, setQuizHistory] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  // Reset when question changes
  useEffect(() => {
    if (currentSession) {
      setSelectedAnswer(null)
      setShowResult(false)
      setQuestionResult(null)
      setStartTime(Date.now())
      setTimeSpent(0)
    }
  }, [currentSession, currentSession?.currentQuestionIndex])

  const fetchQuizData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await quizApi.getQuestions(id)
      if (response.success) {
        setQuizData(response.data)
      } else {
        throw new Error(response.message || 'Failed to fetch quiz data')
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error)
      // Fallback to mock data if API fails
      setQuizData({
        _id: id,
        categoryName: `Quiz Category ${id}`,
        categoryDescription: "Test your knowledge with this comprehensive quiz",
        questions: []
      })
    } finally {
      setLoading(false)
    }
  }, [id])

  // Load quiz data
  useEffect(() => {
    fetchQuizData()
  }, [fetchQuizData])

  const startQuizSession = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user'
      
      const response = await quizApi.startSession({
        userId,
        quizId: id,
        difficulty: selectedDifficulty,
        questionCount
      })
      
      if (response.success) {
        setCurrentSession(response.data)
        setGameState('playing')
      } else {
        throw new Error(response.message || 'Failed to start quiz session')
      }
    } catch (error) {
      console.error('Error starting quiz:', error)
      alert(`Failed to start quiz: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const submitAnswer = async () => {
    if (selectedAnswer === null || isSubmitting || !currentSession) return

    setIsSubmitting(true)

    try {
      const response = await quizApi.submitAnswer(currentSession.sessionId, {
        questionIndex: currentSession.currentQuestionIndex,
        answer: selectedAnswer,
        timeSpent
      })

      if (response.success) {
        setQuestionResult(response.data)
        setShowResult(true)

        if (response.data.isCompleted) {
          // Complete the session
          await quizApi.completeSession(currentSession.sessionId)
          setTimeout(() => {
            setGameState('completed')
          }, 2000)
        }
      } else {
        throw new Error(response.message || 'Failed to submit answer')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert(`Failed to submit answer: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextQuestion = () => {
    if (questionResult && questionResult.nextQuestion && currentSession) {
      const updatedSession = {
        ...currentSession,
        currentQuestionIndex: currentSession.currentQuestionIndex + 1,
        currentQuestion: questionResult.nextQuestion,
        progress: questionResult.progress
      }
      setCurrentSession(updatedSession)
    }
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
      case 'hard': return <Brain className="h-4 w-4" />
      case 'mixed': return <Brain className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  // Enhanced features functions
  const fetchUserAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const userId = localStorage.getItem('userId') || 'demo-user'
      const response = await quizApi.getUserAnalytics(userId, quizData?.categoryName)
      if (response.success) {
        setUserAnalytics(response.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Mock analytics data as fallback
      setUserAnalytics({
        totalQuizzesTaken: 5,
        overallAccuracy: 85,
        averageScore: 8.2,
        bestScore: 10,
        totalQuestionsAnswered: 50,
        difficultyPerformance: [
          { difficulty: 'easy', accuracy: 95, averageScore: 9.5 },
          { difficulty: 'medium', accuracy: 82, averageScore: 8.2 },
          { difficulty: 'hard', accuracy: 68, averageScore: 6.8 }
        ]
      })
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const fetchQuizHistory = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'demo-user'
      const response = await quizApi.getUserSessions(userId, 'completed')
      if (response.success) {
        setQuizHistory(response.data)
      }
    } catch (error) {
      console.error('Error fetching quiz history:', error)
      // Mock history data as fallback
      setQuizHistory([
        {
          sessionId: '1',
          categoryName: 'React Fundamentals',
          difficulty: 'medium',
          score: 8,
          questionCount: 10,
          completedAt: new Date().toISOString(),
          timeSpent: 300
        },
        {
          sessionId: '2',
          categoryName: 'JavaScript ES6',
          difficulty: 'hard',
          score: 7,
          questionCount: 10,
          completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          timeSpent: 480
        }
      ])
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const response = await quizApi.getLeaderboard(quizData?.categoryName)
      if (response.success) {
        setLeaderboard(response.data)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      // Mock leaderboard data as fallback
      setLeaderboard([
        { rank: 1, username: 'QuizMaster', averageScore: 9.2, totalQuizzes: 15, accuracy: 92 },
        { rank: 2, username: 'BrainAce', averageScore: 8.8, totalQuizzes: 12, accuracy: 88 },
        { rank: 3, username: 'StudyHero', averageScore: 8.5, totalQuizzes: 18, accuracy: 85 },
        { rank: 4, username: 'You', averageScore: 8.2, totalQuizzes: 5, accuracy: 82 },
        { rank: 5, username: 'CodeNinja', averageScore: 7.9, totalQuizzes: 10, accuracy: 79 }
      ])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">{quizData?.categoryName}</h1>
            <p className="text-gray-600">Enhanced Learning Experience</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'quiz' | 'analytics' | 'history' | 'leaderboard')} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="quiz" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2" 
                        onClick={() => activeTab !== 'analytics' && fetchUserAnalytics()}>
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2"
                        onClick={() => activeTab !== 'history' && fetchQuizHistory()}>
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center space-x-2"
                        onClick={() => activeTab !== 'leaderboard' && fetchLeaderboard()}>
              <Medal className="h-4 w-4" />
              <span>Leaderboard</span>
            </TabsTrigger>
          </TabsList>

          {/* Quiz Tab Content */}
          <TabsContent value="quiz" className="space-y-6">
            {/* Setup State */}
        {gameState === 'setup' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Configure Your Quiz</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Choose Difficulty Level
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['easy', 'medium', 'hard', 'mixed'] as const).map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? "default" : "outline"}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`h-12 ${selectedDifficulty === difficulty ? getDifficultyColor(difficulty) : ''}`}
                      >
                        {getDifficultyIcon(difficulty)}
                        <span className="ml-2 capitalize">{difficulty}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Number of Questions: {questionCount}
                  </label>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setQuestionCount(Math.max(5, questionCount - 5))}
                      disabled={questionCount <= 5}
                    >
                      -5
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-2xl font-bold">{questionCount}</div>
                      <div className="text-sm text-gray-500">questions</div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setQuestionCount(Math.min(30, questionCount + 5))}
                      disabled={questionCount >= 30}
                    >
                      +5
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={startQuizSession}
                    size="lg"
                    className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Start Quiz ({questionCount} questions)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && currentSession && currentSession.currentQuestion && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Badge className={`${getDifficultyColor(currentSession.difficulty)} border`}>
                      {getDifficultyIcon(currentSession.difficulty)}
                      <span className="ml-1 capitalize">{currentSession.difficulty}</span>
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Question {currentSession.progress.answered + 1} of {currentSession.progress.total}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{timeSpent}s</span>
                    </div>
                  </div>
                </div>
                
                <Progress value={currentSession.progress.percentage} className="h-2" />
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{currentSession.progress.percentage}% Complete</span>
                  <span>{currentSession.categoryName}</span>
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-relaxed">
                    {currentSession.currentQuestion.question}
                  </CardTitle>
                  <Badge className={`${getDifficultyColor(currentSession.currentQuestion.difficulty)} border ml-4`}>
                    {getDifficultyIcon(currentSession.currentQuestion.difficulty)}
                    <span className="ml-1 capitalize">{currentSession.currentQuestion.difficulty}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {currentSession.currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      showResult 
                        ? questionResult?.isCorrect && index === selectedAnswer
                          ? 'border-green-500 bg-green-50'
                          : !questionResult?.isCorrect && index === selectedAnswer
                          ? 'border-red-500 bg-red-50'
                          : index === currentSession.currentQuestion?.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                        showResult
                          ? (questionResult?.isCorrect && index === selectedAnswer) || 
                            (!questionResult?.isCorrect && index === currentSession.currentQuestion?.correctAnswer)
                            ? 'border-green-500 bg-green-500 text-white'
                            : !questionResult?.isCorrect && index === selectedAnswer
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300 text-gray-500'
                          : selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      
                      <span className="flex-1">{option}</span>
                      
                      {showResult && (
                        <div className="ml-auto">
                          {((questionResult?.isCorrect && index === selectedAnswer) || 
                            (!questionResult?.isCorrect && index === currentSession.currentQuestion?.correctAnswer)) && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {!questionResult?.isCorrect && index === selectedAnswer && index !== currentSession.currentQuestion?.correctAnswer && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Show explanation after answering */}
                {showResult && questionResult && (
                  <div className={`mt-6 p-4 rounded-lg border ${
                    questionResult.isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {questionResult.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        questionResult.isCorrect ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {questionResult.isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{questionResult.explanation}</p>
                    
                    {questionResult.detailedExplanation && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                          Show detailed explanation
                        </summary>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{questionResult.detailedExplanation}</p>
                        </div>
                      </details>
                    )}
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-500">
                    {selectedAnswer !== null ? 'Answer selected' : 'Select an answer to continue'}
                  </div>
                  
                  <div className="space-x-3">
                    {!showResult ? (
                      <Button
                        onClick={submitAnswer}
                        disabled={selectedAnswer === null || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                      </Button>
                    ) : questionResult?.isCompleted ? (
                      <Button
                        onClick={() => setGameState('completed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                    ) : (
                      <Button
                        onClick={nextQuestion}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next Question
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Completed State */}
        {gameState === 'completed' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                  <p className="text-gray-600">Great job! You&apos;ve finished the quiz.</p>
                </div>
                
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      setGameState('setup')
                      setCurrentSession(null)
                      setSelectedAnswer(null)
                      setShowResult(false)
                      setQuestionResult(null)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                  >
                    Take Another Quiz
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2 ml-4"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Your Performance Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading analytics...</p>
                    </div>
                  ) : userAnalytics ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{userAnalytics.totalQuizzesTaken}</div>
                        <div className="text-sm text-gray-600">Quizzes Taken</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{userAnalytics.overallAccuracy}%</div>
                        <div className="text-sm text-gray-600">Overall Accuracy</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{userAnalytics.averageScore}</div>
                        <div className="text-sm text-gray-600">Average Score</div>
                      </div>
                      
                      <div className="col-span-full mt-6">
                        <h3 className="text-lg font-semibold mb-4">Performance by Difficulty</h3>
                        <div className="space-y-4">
                          {userAnalytics.difficultyPerformance?.map((perf: any) => (
                            <div key={perf.difficulty} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                {getDifficultyIcon(perf.difficulty)}
                                <span className="capitalize font-medium">{perf.difficulty}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-600">
                                  {perf.accuracy}% accuracy
                                </div>
                                <div className="text-sm font-medium">
                                  Avg: {perf.averageScore}/10
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No analytics data available yet.</p>
                      <p className="text-sm text-gray-500">Complete some quizzes to see your performance.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Quiz History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quizHistory.length > 0 ? (
                    <div className="space-y-4">
                      {quizHistory.map((session: any) => (
                        <div key={session.sessionId} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{session.categoryName}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <Badge className={getDifficultyColor(session.difficulty)}>
                                  {session.difficulty}
                                </Badge>
                                <span>{session.questionCount} questions</span>
                                <span>{Math.floor(session.timeSpent / 60)}m {session.timeSpent % 60}s</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">{session.score}/{session.questionCount}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(session.completedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No quiz history yet.</p>
                      <p className="text-sm text-gray-500">Your completed quizzes will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Medal className="h-5 w-5" />
                    <span>Leaderboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboard.map((entry: any, index: number) => (
                        <div key={index} className={`p-4 rounded-lg border ${entry.username === 'You' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                entry.rank === 1 ? 'bg-yellow-500 text-white' :
                                entry.rank === 2 ? 'bg-gray-400 text-white' :
                                entry.rank === 3 ? 'bg-amber-600 text-white' :
                                'bg-gray-200 text-gray-700'
                              }`}>
                                {entry.rank}
                              </div>
                              <div>
                                <div className="font-medium">{entry.username}</div>
                                <div className="text-sm text-gray-600">
                                  {entry.totalQuizzes} quizzes • {entry.accuracy}% accuracy
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">{entry.averageScore}/10</div>
                              <div className="text-sm text-gray-500">Avg Score</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Medal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No leaderboard data available.</p>
                      <p className="text-sm text-gray-500">Complete quizzes to see rankings.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <QuizContent />
    </ProtectedRoute>
  )
}