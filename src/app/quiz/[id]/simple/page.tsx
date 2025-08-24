'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { simpleQuizApi, QuizQuestion, QuizCategory } from "@/services/simpleQuizApi"
import { Clock, CheckCircle, XCircle, ArrowLeft, Trophy } from "lucide-react"

function SimpleQuizContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<QuizCategory | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [questionTimes, setQuestionTimes] = useState<{ [key: number]: number }>({})
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'completed'>('loading')
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizStartTime] = useState(Date.now())
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    loadQuiz()
  }, [quizId])

  useEffect(() => {
    if (gameState === 'playing') {
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestionIndex, gameState])

  const loadQuiz = async () => {
    try {
      const response = await simpleQuizApi.getQuiz(quizId)
      if (response.success) {
        setQuiz(response.data)
        setGameState('playing')
      } else {
        throw new Error(response.error || 'Failed to load quiz')
      }
    } catch (error) {
      console.error('Error loading quiz:', error)
      alert('Failed to load quiz. Please try again.')
      router.back()
    }
  }

  const selectAnswer = (answerIndex: number) => {
    if (showExplanation) return
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }))
  }

  const nextQuestion = () => {
    // Record time spent on current question
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    setQuestionTimes(prev => ({
      ...prev,
      [currentQuestionIndex]: timeSpent
    }))

    if (showExplanation) {
      setShowExplanation(false)
      if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        completeQuiz()
      }
    } else {
      setShowExplanation(true)
    }
  }

  const completeQuiz = async () => {
    if (!quiz || !user?.id) return

    try {
      const totalTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000)
      
      const answers = quiz.questions.map((question, index) => {
        const selectedAnswer = selectedAnswers[index] ?? -1
        const isCorrect = selectedAnswer === question.correctAnswer
        const timeSpent = questionTimes[index] || 0
        
        return {
          questionIndex: index,
          selectedAnswer,
          isCorrect,
          timeSpent
        }
      })

      const submission = {
        userId: user.id,
        answers,
        totalTimeSpent
      }

      const response = await simpleQuizApi.submitQuiz(quizId, submission)
      
      if (response.success) {
        setResult(response.data)
        setGameState('completed')
      } else {
        throw new Error(response.error || 'Failed to submit quiz')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Failed to submit quiz. Please try again.')
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setQuestionTimes({})
    setShowExplanation(false)
    setResult(null)
    loadQuiz()
  }

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (gameState === 'completed' && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
                <p className="text-gray-600 mb-6">Great job finishing the quiz</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{result.score}%</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.correctAnswers}/{result.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-6 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(result.totalTimeSpent / 60)}m {result.totalTimeSpent % 60}s</span>
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={restartQuiz}
                    className="w-full"
                  >
                    Take Quiz Again
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/simple')}
                    className="w-full"
                  >
                    Back to Dashboard
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/performance')}
                    className="w-full"
                  >
                    View Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz || gameState !== 'playing') {
    return null
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const selectedAnswer = selectedAnswers[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const hasSelectedAnswer = selectedAnswer !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/simple')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.categoryName}</h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
          
          <div className="w-20"></div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Options */}
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    showExplanation
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : index === selectedAnswer
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                      showExplanation
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500 text-white'
                          : index === selectedAnswer
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300 text-gray-500'
                        : selectedAnswer === index
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    
                    <span className="flex-1">{option}</span>
                    
                    {showExplanation && (
                      <div className="ml-auto">
                        {index === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Explanation */}
              {showExplanation && (
                <div className={`mt-6 p-4 rounded-lg border ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      selectedAnswer === currentQuestion.correctAnswer ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <p className="text-gray-700">{currentQuestion.explanation}</p>
                </div>
              )}
              
              {/* Action Button */}
              <div className="flex justify-end pt-4">
                {!showExplanation ? (
                  <Button
                    onClick={nextQuestion}
                    disabled={!hasSelectedAnswer}
                    className="px-8"
                  >
                    {hasSelectedAnswer ? 'Submit Answer' : 'Select an answer'}
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="px-8"
                  >
                    {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SimpleQuiz() {
  return (
    <ProtectedRoute>
      <SimpleQuizContent />
    </ProtectedRoute>
  )
}