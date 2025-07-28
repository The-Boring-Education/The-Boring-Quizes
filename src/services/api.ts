import axios from "axios"
import Cookies from "js-cookie"
import { config, API_ENDPOINTS } from "../config"

// Create axios instance
const api = axios.create({
    baseURL: config.API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("next-auth.session-token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - redirect to login
            window.location.href = "/"
        }
        return Promise.reject(error)
    }
)

// Auth APIs
export const authApi = {
    getSession: () => api.get(API_ENDPOINTS.AUTH_SESSION),
    signOut: () => api.post(API_ENDPOINTS.AUTH_SIGNOUT)
}

// Quiz APIs
export const quizApi = {
    getCategories: () => api.get(API_ENDPOINTS.QUIZ_CATEGORIES),
    getQuestions: (categoryId: string) =>
        api.get(API_ENDPOINTS.QUIZ_QUESTIONS(categoryId)),
    submitQuiz: (data: {
        categoryId: string
        answers: (number | null)[]
        timeTaken: number
    }) => api.post(API_ENDPOINTS.QUIZ_SUBMIT, data),
    getHistory: (params?: { limit?: number; categoryId?: string }) =>
        api.get(API_ENDPOINTS.QUIZ_HISTORY, { params })
}

// Gamification APIs
export const gamificationApi = {
    getUserPoints: () => api.get(API_ENDPOINTS.USER_POINTS),
    getLeaderboard: (limit?: number) =>
        api.get(API_ENDPOINTS.LEADERBOARD, { params: { limit } })
}

export default api
