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
    QUIZ_CATEGORIES: "/quiz/categories",
    QUIZ_QUESTIONS: (categoryId: string) => `/quiz/${categoryId}/questions`,
    QUIZ_SUBMIT: "/quiz/submit",
    QUIZ_HISTORY: "/quiz/history",

    // Gamification
    USER_POINTS: "/gamification/points",
    LEADERBOARD: "/gamification/leaderboard"
}
