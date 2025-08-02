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
    categoryId: string
    categoryName: string
    categoryDescription: string
    categoryIcon: string
}
