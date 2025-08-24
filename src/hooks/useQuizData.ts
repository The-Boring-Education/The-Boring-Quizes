import { useState, useEffect } from 'react'

interface QuizCategory {
  _id: string
  categoryName: string
  categoryDescription: string
  categoryIcon: string
  questions?: any[]
}

interface UseQuizDataReturn {
  categories: QuizCategory[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useQuizData(): UseQuizDataReturn {
  const [categories, setCategories] = useState<QuizCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/quiz`)
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      } else {
        throw new Error(data.error || 'Failed to load categories')
      }
    } catch (err) {
      console.error('Error loading categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  }
}