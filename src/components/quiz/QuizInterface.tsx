'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Trophy,
  Target,
  Zap,
  Brain
} from "lucide-react"
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer"

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

interface QuizInterfaceProps {
  session: QuizSession
  onComplete: (results: any) => void
  onSessionUpdate: (session: QuizSession) => void
}

export function QuizInterface({ session, onComplete, onSessionUpdate }: QuizInterfaceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questionResult, setQuestionResult] = useState<any>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null)
    setShowResult(false)
    setQuestionResult(null)
    setStartTime(Date.now())
    setTimeSpent(0)
  }, [session.currentQuestionIndex])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  const currentQuestion = session.currentQuestion

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">No question available</p>
        </CardContent>
      </Card>
    )
  }

  const submitAnswer = async () => {
    if (selectedAnswer === null || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/v1/quiz/session/${session.sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIndex: session.currentQuestionIndex,
          answer: selectedAnswer,
          timeSpent,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setQuestionResult(result.data)
        setShowResult(true)

        // If quiz is completed, handle completion
        if (result.data.isCompleted) {
          setTimeout(async () => {
            await completeQuiz()
          }, 2000)
        }
      } else {
        alert('Failed to submit answer: ' + result.error)
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const completeQuiz = async () => {
    try {
      const response = await fetch(`/api/v1/quiz/session/${session.sessionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await response.json()

      if (result.success) {
        onComplete(result.data)
      } else {
        alert('Failed to complete quiz: ' + result.error)
      }
    } catch (error) {
      console.error('Error completing quiz:', error)
      alert('Failed to complete quiz')
    }
  }

  const nextQuestion = () => {
    if (questionResult && questionResult.nextQuestion) {
      const updatedSession = {
        ...session,
        currentQuestionIndex: questionResult.nextQuestion.index,
        currentQuestion: {
          question: questionResult.nextQuestion.question,
          options: questionResult.nextQuestion.options,
          difficulty: questionResult.nextQuestion.difficulty,
        },
        progress: questionResult.progress,
      }
      onSessionUpdate(updatedSession)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'hard': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return <Zap className="h-4 w-4" />
      case 'medium': return <Target className="h-4 w-4" />
      case 'hard': return <Brain className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge className={`${getDifficultyColor(session.difficulty)} border`}>
                {getDifficultyIcon(session.difficulty)}
                <span className="ml-1 capitalize">{session.difficulty}</span>
              </Badge>
              <span className="text-sm text-gray-600">
                Question {session.progress.answered + 1} of {session.progress.total}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{timeSpent}s</span>
              </div>
            </div>
          </div>
          
          <Progress 
            value={session.progress.percentage} 
            className="h-2"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{session.progress.percentage}% Complete</span>
            <span>{session.categoryName}</span>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-relaxed">
              <MarkdownRenderer content={currentQuestion.question} />
            </CardTitle>
            <Badge className={`${getDifficultyColor(currentQuestion.difficulty)} border ml-4`}>
              {getDifficultyIcon(currentQuestion.difficulty)}
              <span className="ml-1 capitalize">{currentQuestion.difficulty}</span>
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                showResult 
                  ? questionResult?.isCorrect && index === selectedAnswer
                    ? 'border-green-500 bg-green-50'
                    : !questionResult?.isCorrect && index === selectedAnswer
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  showResult
                    ? questionResult?.isCorrect && index === selectedAnswer
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
                
                <MarkdownRenderer content={option} />
                
                {showResult && (
                  <div className="ml-auto">
                    {questionResult?.isCorrect && index === selectedAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {!questionResult?.isCorrect && index === selectedAnswer && (
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
              
              <MarkdownRenderer 
                content={questionResult.explanation} 
                className="text-sm text-gray-700"
              />
              
              {questionResult.detailedExplanation && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                    Show detailed explanation
                  </summary>
                  <div className="mt-2">
                    <MarkdownRenderer 
                      content={questionResult.detailedExplanation} 
                      className="text-sm text-gray-600"
                    />
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
                  onClick={completeQuiz}
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
  )
}