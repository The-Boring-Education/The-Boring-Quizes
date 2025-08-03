export const config = {
    API_BASE_URL: import.meta.env.VITE_TBE_WEBAPP_API_URL,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    ONBOARDING_APP_URL: import.meta.env.VITE_ONBOARDING_APP_URL
}

export const API_ENDPOINTS = {
    // Auth
    AUTH_SESSION: "/auth/session",
    AUTH_SIGNOUT: "/auth/signout",

    // Quiz - Updated to match TBE webapp structure
    QUIZ_CATEGORIES: "/quiz",
    QUIZ_QUESTIONS: (categoryId: string) => `/quiz/${categoryId}`,
    QUIZ_SUBMIT: "/quiz/submit",
    QUIZ_HISTORY: "/quiz/history",
    QUIZ_ATTEMPTS: "/quiz/attempts",

    // User
    USER_CREATE: "/user",
    USER_ONBOARDING: "/user/onboarding",

    // Gamification
    USER_POINTS: "/gamification/points",
    LEADERBOARD: "/gamification/leaderboard"
}
