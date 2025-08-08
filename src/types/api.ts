export interface QuizAttempt {
    _id: string
    categoryId: string
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
    categoryId: string
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
    categoryId: string
    categoryName: string
    categoryDescription: string
    categoryIcon: string
    questions: QuizQuestion[]
}