export interface QuizAttempt {
    _id: string
    quizId: string
    categoryName: string
    score: number
    correctAnswers: number
    totalQuestions: number
    timeTaken: number
    pointsEarned: number
    completedAt: string
}

export interface QuizStats {
    totalQuizzes: number
    totalPoints: number
    totalCorrectAnswers: number
    totalQuestions: number
    averageScore: number
    averageTimeTaken: number
    overallAccuracy: number
}

export interface QuizHistoryResponse {
    history: QuizAttempt[]
    stats: QuizStats
}

export interface UserPoints {
    points: number
}

export interface LeaderboardEntry {
    userId: string
    points: number
    user: {
        name: string
        email: string
        image?: string
    }
}

export interface QuizCategoryAPI {
    _id: string
    categoryName: string
    categoryDescription: string
    categoryIcon: string
}

// Generic API Response wrapper
export interface APIResponse<T> {
    success: boolean
    message?: string
    data: T
}

// Specific response types  
export interface QuizCategoriesResponse {
    data: QuizCategoryAPI[]
}

// Quiz Question interfaces
export interface QuizQuestion {
    _id?: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
    detailedExplanation?: string
    difficulty?: string
}

export interface QuizQuestionsData {
    _id: string
    categoryName: string
    categoryDescription: string
    categoryIcon: string
    questions: QuizQuestion[]
}

// Enhanced Analytics Types
export interface PerformanceMetrics {
    totalAttempts: number
    totalScore: number
    averageScore: number
    bestScore: number
    totalTimeSpent: number
    averageTimePerQuiz: number
    accuracyRate: number
    improvementRate: number
    streakDays: number
    lastActiveDate: string
}

export interface CategoryPerformance {
    categoryId: string
    categoryName: string
    attempts: number
    bestScore: number
    averageScore: number
    totalTimeSpent: number
    lastAttemptDate: string
    improvementTrend: 'improving' | 'declining' | 'stable'
}

export interface PerformanceHistory {
    date: string
    score: number
    timeTaken: number
    categoryName: string
    quizId: string
}

export interface LeaderboardData {
    rank: number
    userId: string
    userName: string
    userImage?: string
    totalPoints: number
    totalQuizzes: number
    averageScore: number
    streakDays: number
    achievements: string[]
}

export interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    unlockedAt: string
    points: number
}

export interface UserProfile {
    userId: string
    userName: string
    userEmail: string
    userImage?: string
    totalPoints: number
    rank: number
    achievements: Achievement[]
    joinDate: string
    lastActiveDate: string
}