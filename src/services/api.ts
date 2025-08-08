import { apiClient, APIError } from "./base"
import { API_ENDPOINTS } from "@/config"
import { APIResponse, QuizCategoriesResponse, QuizAttemptsResponse, QuizQuestionsResponse } from "@/types/api"

// User APIs
export const userApi = {
    createOrFindUser: async (data: {
        name: string
        email: string
        image?: string
        provider: string
        providerAccountId: string
    }) => {
        try {
            return await apiClient.post(API_ENDPOINTS.USER_CREATE, data)
        } catch (error) {
            console.error("Error creating/finding user:", error)
            throw error
        }
    },

    getUserByEmail: async (email: string) => {
        try {
            return await apiClient.get(API_ENDPOINTS.USER_CREATE, {
                params: { email }
            })
        } catch (error) {
            console.error("Error getting user by email:", error)
            throw error
        }
    },

    onboardUser: async (
        userId: string,
        data: {
            userName: string
            occupation: string
            purpose: string[]
            contactNo?: string
        }
    ) => {
        try {
            return await apiClient.post(API_ENDPOINTS.USER_ONBOARDING, data, {
                params: { userId }
            })
        } catch (error) {
            console.error("Error onboarding user:", error)
            throw error
        }
    },

    checkUsername: async (userName: string) => {
        try {
            return await apiClient.get(API_ENDPOINTS.USER_ONBOARDING, {
                params: { userName }
            })
        } catch (error) {
            console.error("Error checking username:", error)
            throw error
        }
    }
}

// Auth APIs (for future use)
export const authApi = {
    getSession: async () => {
        try {
            return await apiClient.get(API_ENDPOINTS.AUTH_SESSION)
        } catch (error) {
            console.error("Error getting session:", error)
            throw error
        }
    },

    signOut: async () => {
        try {
            return await apiClient.post(API_ENDPOINTS.AUTH_SIGNOUT)
        } catch (error) {
            console.error("Error signing out:", error)
            throw error
        }
    }
}

// Quiz APIs
export const quizApi = {
    getCategories: async (): Promise<APIResponse<QuizCategoriesResponse>> => {
        try {
            return await apiClient.get<APIResponse<QuizCategoriesResponse>>(API_ENDPOINTS.QUIZ_CATEGORIES)
        } catch (error) {
            console.error("Error fetching quiz categories:", error)
            throw error
        }
    },

    getQuestions: async (categoryId: string): Promise<APIResponse<QuizQuestionsResponse>> => {
        try {
            return await apiClient.get<APIResponse<QuizQuestionsResponse>>(API_ENDPOINTS.QUIZ_QUESTIONS(categoryId))
        } catch (error) {
            console.error("Error fetching quiz questions:", error)
            throw error
        }
    },

    submitAttempt: async (
        categoryId: string, 
        data: {
            userId: string
            answers: number[]
            timeTaken: number
        }
    ) => {
        try {
            return await apiClient.post(
                `${API_ENDPOINTS.QUIZ_QUESTIONS(categoryId)}/attempt`, 
                data
            )
        } catch (error) {
            console.error("Error submitting quiz attempt:", error)
            throw error
        }
    },

    getUserAttempts: async (userId: string): Promise<APIResponse<QuizAttemptsResponse>> => {
        try {
            return await apiClient.get<APIResponse<QuizAttemptsResponse>>(API_ENDPOINTS.QUIZ_ATTEMPTS, {
                params: { userId }
            })
        } catch (error) {
            console.error("Error fetching user attempts:", error)
            throw error
        }
    }
}

export { apiClient, APIError }