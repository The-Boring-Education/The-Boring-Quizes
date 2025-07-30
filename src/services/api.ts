import axios from "axios"
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
        const token = localStorage.getItem("quizToken")
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

// User APIs
export const userApi = {
    createOrFindUser: (data: {
        name: string
        email: string
        image?: string
        provider: string
        providerAccountId: string
    }) => api.post("/user", data),

    getUserByEmail: (email: string) => api.get(`/user?email=${email}`),

    onboardUser: (
        userId: string,
        data: {
            userName: string
            occupation: string
            purpose: string[]
            contactNo?: string
        }
    ) => api.post(`/user/onbording?userId=${userId}`, data),

    checkUsername: (userName: string) =>
        api.get(`/user/onbording?userName=${userName}`)
}

// Auth APIs (for future use)
export const authApi = {
    getSession: () => api.get(API_ENDPOINTS.AUTH_SESSION),
    signOut: () => api.post(API_ENDPOINTS.AUTH_SIGNOUT)
}

// Quiz APIs
export const quizApi = {
    getCategories: () => api.get(API_ENDPOINTS.QUIZ_CATEGORIES),
    getQuestions: (categoryId: string) =>
        api.get(API_ENDPOINTS.QUIZ_QUESTIONS(categoryId))
}

export default api
