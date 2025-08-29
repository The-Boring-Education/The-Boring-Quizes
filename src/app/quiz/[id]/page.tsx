import { Metadata } from 'next'
import QuizContent from './QuizContent'
import { quizApi } from '@/services/quizApi'
import { ProtectedRoute } from '@/components/ProtectedRoute'

interface QuizPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  try {
    const response = await quizApi.getCategories()
    if (response.success) {
      return response.data.map((cat: any) => ({ id: cat._id }))
    }
  } catch (error) {
    // ignore errors
  }
  return []
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const id = params.id
  try {
    const response = await quizApi.getQuestions(id)
    if (response.success) {
      const quiz = response.data
      const title = `${quiz.categoryName} Quiz - The Boring Quizes`
      const description = quiz.categoryDescription
      return {
        title,
        description,
        openGraph: { title, description },
        twitter: { title, description }
      }
    }
  } catch (error) {
    // ignore errors
  }
  return {
    title: 'Quiz - The Boring Quizes',
    description: 'Practice quizzes and master tech interviews.'
  }
}

export default function QuizPage({ params }: QuizPageProps) {
  return (
    <ProtectedRoute>
      <QuizContent quizId={params.id} />
    </ProtectedRoute>
  )
}
