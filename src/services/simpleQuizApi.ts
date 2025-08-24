const API_BASE_URL = process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL || 'http://localhost:3000'

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  detailedExplanation: string
}

export interface QuizCategory {
  _id: string
  categoryName: string
  categoryDescription: string
  categoryIcon: string
  questions: QuizQuestion[]
}

export interface QuizSubmission {
  userId: string
  answers: {
    questionIndex: number
    selectedAnswer: number
    isCorrect: boolean
    timeSpent: number
  }[]
  totalTimeSpent: number
}

export interface QuizResult {
  attemptId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  percentage: number
  totalTimeSpent: number
  results: {
    questionIndex: number
    isCorrect: boolean
    selectedAnswer: number
    correctAnswer: number
    timeSpent: number
    explanation: string
    detailedExplanation: string
  }[]
  categoryName: string
}

export interface UserPerformance {
  totalAttempts: number
  totalQuizzes: number
  averageScore: number
  bestScore: number
  totalTimeSpent: number
  categoryBreakdown: {
    categoryName: string
    attempts: number
    averageScore: number
    bestScore: number
  }[]
  recentAttempts: {
    _id: string
    quizId: string
    categoryName: string
    score: number
    completedAt: string
    totalTimeSpent: number
  }[]
}

export interface LeaderboardEntry {
  userId: string
  username: string
  averageScore: number
  totalAttempts: number
  bestScore: number
  totalTimeSpent: number
  rank: number
}

export const simpleQuizApi = {
  // Get all quiz categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/quiz`)
    if (!response.ok) throw new Error('Failed to fetch quiz categories')
    return response.json()
  },

  // Get 10 questions for a quiz
  getQuiz: async (quizId: string) => {
    const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`)
    if (!response.ok) throw new Error('Failed to fetch quiz questions')
    return response.json()
  },

  // Submit completed quiz
  submitQuiz: async (quizId: string, submission: QuizSubmission) => {
    const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    })
    if (!response.ok) throw new Error('Failed to submit quiz')
    return response.json()
  },

  // Get user performance
  getUserPerformance: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/quiz/performance/${userId}`)
    if (!response.ok) throw new Error('Failed to fetch user performance')
    return response.json()
  },

  // Get leaderboard
  getLeaderboard: async (category?: string, limit: number = 50) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    params.append('limit', limit.toString())
    
    const response = await fetch(`${API_BASE_URL}/quiz/leaderboard?${params}`)
    if (!response.ok) throw new Error('Failed to fetch leaderboard')
    return response.json()
  }
}