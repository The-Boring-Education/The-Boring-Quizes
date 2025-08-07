export const config = {
    API_BASE_URL: process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL,
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    ONBOARDING_APP_URL: process.env.NEXT_PUBLIC_ONBOARDING_APP_URL
}

export const API_ENDPOINTS = {
    // Auth
    AUTH_SESSION: "/api/v1/auth/session",
    AUTH_SIGNOUT: "/api/v1/auth/signout",

    // Quiz - Updated to match TBE webapp structure
    QUIZ_CATEGORIES: "/api/v1/quiz",
    QUIZ_QUESTIONS: (categoryId: string) => `/api/v1/quiz/${categoryId}`,
    QUIZ_SUBMIT: "/api/v1/quiz/submit",
    QUIZ_HISTORY: "/api/v1/quiz/history",
    QUIZ_ATTEMPTS: "/api/v1/quiz/attempts",

    // User
    USER_CREATE: "/api/v1/user",
    USER_ONBOARDING: "/api/v1/user/onbording",

    // Gamification
    USER_POINTS: "/api/v1/gamification/points",
    LEADERBOARD: "/api/v1/gamification/leaderboard"
}