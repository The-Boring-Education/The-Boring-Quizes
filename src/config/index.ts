export const config = {
    API_BASE_URL: import.meta.env.VITE_TBE_WEBAPP_API_URL,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID
}

export const API_ENDPOINTS = {
    // Auth
    AUTH_SESSION: "/api/auth/session",
    AUTH_SIGNOUT: "/api/auth/signout",

    // Quiz - Updated to match TBE webapp structure
    QUIZ_CATEGORIES: "/quiz",
    QUIZ_QUESTIONS: (categoryId: string) => `/quiz/${categoryId}`,
    QUIZ_SUBMIT: "/quiz/submit",
    QUIZ_HISTORY: "/quiz/history",

    // User
    USER_CREATE: "/user",
    USER_ONBOARDING: "/user/onbording",

    // Gamification
    USER_POINTS: "/gamification/points",
    LEADERBOARD: "/gamification/leaderboard"
}
