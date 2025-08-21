'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { quizApi } from "@/services/api"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { DifficultySelector } from "@/components/quiz/DifficultySelector"
import { QuizInterface } from "@/components/quiz/QuizInterface"
import { QuizAnalytics } from "@/components/quiz/QuizAnalytics"
import { QuizHistory } from "@/components/quiz/QuizHistory"
import { QuizLeaderboard } from "@/components/quiz/QuizLeaderboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Trophy, TrendingUp, Clock, Target } from "lucide-react"

interface QuizSession {
  sessionId: string
  categoryName: string
  difficulty: string
  questionCount: number
  currentQuestionIndex: number
  currentQuestion: {
    question: string
    options: string[]
    difficulty: string
  } | null
  progress: {
    answered: number
    total: number
    percentage: number
  }
}

function EnhancedQuizContent() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [gameState, setGameState] = useState<'setup' | 'playing' | 'completed'>('setup')
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('medium')
  const [questionCount, setQuestionCount] = useState(10)

  // Fetch quiz category data
  const { data: quizData, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => quizApi.getQuestions(id!),
    enabled: !!id
  })

  // Start a new quiz session
  const startQuizSession = async () => {
    try {
      // Get user ID from localStorage or auth context
      const userId = localStorage.getItem('userId') || 'demo-user'
      
      const response = await fetch('/api/v1/quiz/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          quizId: id,
          difficulty: selectedDifficulty,
          questionCount,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        setCurrentSession(result.data)
        setGameState('playing')
      } else {
        alert('Failed to start quiz: ' + result.error)
      }
    } catch (error) {
      console.error('Error starting quiz:', error)
      alert('Failed to start quiz')
    }
  }

  // Handle quiz completion
  const handleQuizComplete = (results: any) => {
    setGameState('completed')
    setCurrentSession(null)
  }

  if (quizLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  const categoryName = quizData?.data?.categoryName || "Quiz"

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
            <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
            <p className="text-gray-600">Enhanced Learning Experience</p>
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Game State: Setup */}
        {gameState === 'setup' && (
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="start" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="start" className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Start Quiz</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>History</span>
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="start" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Configure Your Quiz</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <DifficultySelector
                      selectedDifficulty={selectedDifficulty}
                      onDifficultyChange={setSelectedDifficulty}
                      questionCount={questionCount}
                      onQuestionCountChange={setQuestionCount}
                    />
                    
                    <div className="flex justify-center">
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
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <QuizAnalytics quizId={id} />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <QuizHistory quizId={id} />
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-6">
                <QuizLeaderboard categoryName={categoryName} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Game State: Playing */}
        {gameState === 'playing' && currentSession && (
          <div className="max-w-4xl mx-auto">
            <QuizInterface
              session={currentSession}
              onComplete={handleQuizComplete}
              onSessionUpdate={setCurrentSession}
            />
          </div>
        )}

        {/* Game State: Completed */}
        {gameState === 'completed' && (
          <div className="max-w-4xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                  <p className="text-gray-600">Great job! Check your results and analytics.</p>
                </div>
                
                <div className="space-y-4">
                  <Button
                    onClick={() => setGameState('setup')}
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
      </div>
    </div>
  )
}

export default function EnhancedQuizPage() {
  return (
    <ProtectedRoute>
      <EnhancedQuizContent />
    </ProtectedRoute>
  )
}