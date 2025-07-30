export const config = {
    API_BASE_URL: import.meta.env.VITE_TBE_WEBAPP_API_URL,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID
}

export const API_ENDPOINTS = {
    // Auth
    AUTH_SESSION: "/api/auth/session",
    AUTH_GOOGLE: "/api/auth/callback/google",
    AUTH_SIGNOUT: "/api/auth/signout",

    // Quiz
    QUIZ_CATEGORIES: "/api/v1/quiz/categories",
    QUIZ_QUESTIONS: (categoryId: string) =>
        `/api/v1/quiz/${categoryId}/questions`,
    QUIZ_SUBMIT: "/api/v1/quiz/submit",
    QUIZ_HISTORY: "/api/v1/quiz/history",

    // Gamification
    USER_POINTS: "/api/v1/gamification/points",
    LEADERBOARD: "/api/v1/gamification/leaderboard"
}
