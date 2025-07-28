export const config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
    AUTH_REDIRECT_URL:
        import.meta.env.VITE_AUTH_REDIRECT_URL ||
        "http://localhost:3000/api/auth/callback/google"
}

export const API_ENDPOINTS = {
    // Auth
    AUTH_SESSION: "/api/auth/session",
    AUTH_GOOGLE: "/api/auth/callback/google",
    AUTH_SIGNOUT: "/api/auth/signout",

    // Quiz
    QUIZ_CATEGORIES: "/api/quiz/categories",
    QUIZ_QUESTIONS: (categoryId: string) => `/api/quiz/${categoryId}/questions`,
    QUIZ_SUBMIT: "/api/quiz/submit",
    QUIZ_HISTORY: "/api/quiz/history",

    // Gamification
    USER_POINTS: "/api/gamification/points",
    LEADERBOARD: "/api/gamification/leaderboard"
}
