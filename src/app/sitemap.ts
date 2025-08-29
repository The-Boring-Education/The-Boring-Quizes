import { MetadataRoute } from 'next'
import { quizApi } from '@/services/quizApi'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quiz.theboringeducation.com'

  const routes: MetadataRoute.Sitemap = [
    '',
    '/login',
    '/dashboard',
    '/leaderboard'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }))

  try {
    const response = await quizApi.getCategories()
    if (response.success) {
      const quizRoutes = response.data.map((cat: any) => ({
        url: `${baseUrl}/quiz/${cat._id}`,
        lastModified: new Date()
      }))
      routes.push(...quizRoutes)
    }
  } catch {
    // ignore
  }

  return routes
}
