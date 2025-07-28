import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexts/AuthContext"
import { quizApi, gamificationApi } from "../services/api"
import { Trophy, Target, Clock, TrendingUp, History } from "lucide-react"
import type { QuizAttempt } from "../types/api"

export default function UserDashboard({ onClose }: { onClose: () => void }) {
    const { user } = useAuth()

    const { data: historyData } = useQuery({
        queryKey: ["quiz-history"],
        queryFn: () => quizApi.getHistory({ limit: 10 })
    })

    const { data: pointsData } = useQuery({
        queryKey: ["user-points"],
        queryFn: () => gamificationApi.getUserPoints()
    })

    const history = historyData?.data?.data?.history || []
    const stats = historyData?.data?.data?.stats || {}
    const points = pointsData?.data?.data?.points || 0

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
                <div className='p-6 border-b'>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-2xl font-bold'>Your Dashboard</h2>
                        <button
                            onClick={onClose}
                            className='text-gray-500 hover:text-gray-700'>
                            ✕
                        </button>
                    </div>
                </div>

                <div className='p-6'>
                    {/* User Info */}
                    <div className='flex items-center space-x-4 mb-8'>
                        {user?.image && (
                            <img
                                src={user.image}
                                alt={user.name}
                                className='w-16 h-16 rounded-full'
                            />
                        )}
                        <div>
                            <h3 className='text-xl font-semibold'>
                                {user?.name}
                            </h3>
                            <p className='text-gray-600'>{user?.email}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
                        <div className='bg-gray-50 rounded-xl p-4'>
                            <div className='flex items-center justify-between mb-2'>
                                <Trophy className='w-5 h-5 text-yellow-500' />
                                <span className='text-2xl font-bold'>
                                    {points}
                                </span>
                            </div>
                            <p className='text-sm text-gray-600'>
                                Total Points
                            </p>
                        </div>

                        <div className='bg-gray-50 rounded-xl p-4'>
                            <div className='flex items-center justify-between mb-2'>
                                <Target className='w-5 h-5 text-blue-500' />
                                <span className='text-2xl font-bold'>
                                    {stats.totalQuizzes || 0}
                                </span>
                            </div>
                            <p className='text-sm text-gray-600'>
                                Quizzes Taken
                            </p>
                        </div>

                        <div className='bg-gray-50 rounded-xl p-4'>
                            <div className='flex items-center justify-between mb-2'>
                                <TrendingUp className='w-5 h-5 text-green-500' />
                                <span className='text-2xl font-bold'>
                                    {stats.overallAccuracy || 0}%
                                </span>
                            </div>
                            <p className='text-sm text-gray-600'>Accuracy</p>
                        </div>

                        <div className='bg-gray-50 rounded-xl p-4'>
                            <div className='flex items-center justify-between mb-2'>
                                <Clock className='w-5 h-5 text-purple-500' />
                                <span className='text-2xl font-bold'>
                                    {stats.averageTimeTaken || 0}s
                                </span>
                            </div>
                            <p className='text-sm text-gray-600'>Avg Time</p>
                        </div>
                    </div>

                    {/* Quiz History */}
                    <div>
                        <h3 className='text-lg font-semibold mb-4 flex items-center'>
                            <History className='w-5 h-5 mr-2' />
                            Recent Quiz History
                        </h3>
                        <div className='space-y-3'>
                            {history.length === 0 ? (
                                <p className='text-gray-500 text-center py-4'>
                                    No quiz history yet. Start your first quiz!
                                </p>
                            ) : (
                                history.map((attempt: QuizAttempt) => (
                                    <div
                                        key={attempt._id}
                                        className='bg-gray-50 rounded-lg p-4 flex justify-between items-center'>
                                        <div>
                                            <p className='font-medium'>
                                                {attempt.categoryName}
                                            </p>
                                            <p className='text-sm text-gray-600'>
                                                Score: {attempt.score}% •{" "}
                                                {attempt.correctAnswers}/
                                                {attempt.totalQuestions} correct
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-sm font-medium'>
                                                +{attempt.pointsEarned} pts
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                {new Date(
                                                    attempt.completedAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
