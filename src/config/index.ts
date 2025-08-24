export const config = {
    API_BASE_URL: process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL as string,
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    ONBOARDING_APP_URL: process.env.NEXT_PUBLIC_ONBOARDING_APP_URL as string
}

export const API_ENDPOINTS = {
    // Auth
    AUTH_SESSION: "/api/v1/auth/session",
    AUTH_SIGNOUT: "/api/v1/auth/signout",

    // Quiz - Updated to match TBE webapp structure
    QUIZ_CATEGORIES: "/quiz",
    QUIZ_QUESTIONS: (id: string) => `/quiz/${id}`,
    QUIZ_SUBMIT: (id: string) => `/quiz/${id}/submit`,
    QUIZ_PERFORMANCE: (userId: string) => `/quiz/performance/${userId}`,
    QUIZ_LEADERBOARD: "/quiz/leaderboard",
    QUIZ_HISTORY: "/quiz/history",
    QUIZ_ATTEMPTS: "/quiz/attempts",

    // User
    USER_CREATE: "/api/v1/user",
    USER_ONBOARDING: "/api/v1/user/onboarding",
    USER_PROFILE: "/api/v1/user/profile",

    // Analytics & Performance
    ANALYTICS_PERFORMANCE: "/api/v1/analytics/performance",
    ANALYTICS_CATEGORY_PERFORMANCE: "/api/v1/analytics/category-performance",
    ANALYTICS_HISTORY: "/api/v1/analytics/history",

    // Gamification
    USER_POINTS: "/api/v1/gamification/points",
    LEADERBOARD: "/api/v1/gamification/leaderboard",
    USER_RANK: "/api/v1/gamification/user-rank"
}