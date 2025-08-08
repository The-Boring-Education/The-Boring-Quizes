'use client'

import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { quizApi } from "@/services/api"
import { Question } from "@/types/quiz"
import { APIResponse, QuizQuestionsData, QuizQuestion } from "@/types/api"
import { ArrowLeft, Clock } from "lucide-react"
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer"
import { ProtectedRoute } from "@/components/ProtectedRoute"

function QuizContent() {
    const params = useParams()
    const router = useRouter()
    const categoryId = params.categoryId as string

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<(number | null)[]>([])
    const [timeLeft, setTimeLeft] = useState(30)
    const [startTime] = useState(Date.now())
    const [isActive, setIsActive] = useState(true)

    // Fetch quiz data from TBE webapp API
    const {
        data: quizData,
        isLoading,
        error
    } = useQuery<APIResponse<QuizQuestionsData>>({
        queryKey: ["quiz", categoryId],
        queryFn: () => quizApi.getQuestions(categoryId!),
        enabled: !!categoryId
    })

    const questions: Question[] = useMemo(() => {
        return (
            quizData?.data?.questions?.map((q: QuizQuestion) => ({
                id: q._id || Math.random(),
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                detailedExplanation: q.detailedExplanation || q.explanation,
                category: quizData?.data?.categoryName || "",
                difficulty: q.difficulty || "medium"
            })) || []
        )
    }, [quizData?.data?.questions, quizData?.data?.categoryName])

    // Initialize answers array when questions are loaded
    useEffect(() => {
        if (questions.length > 0 && answers.length === 0) {
            setAnswers(new Array(questions.length).fill(null))
        }
    }, [questions, answers.length])

    const handleAnswerSelect = useCallback(
        (answerIndex: number) => {
            if (!isActive) return

            const newAnswers = [...answers]
            newAnswers[currentQuestion] = answerIndex
            setAnswers(newAnswers)

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion((prev) => prev + 1)
                setTimeLeft(30) // Reset timer for next question
            } else {
                // Quiz completed
                setIsActive(false)
                const timeTaken = Math.floor((Date.now() - startTime) / 1000)
                router.push(`/results/${categoryId}?answers=${JSON.stringify(newAnswers)}&timeTaken=${timeTaken}`)
            }
        },
        [
            currentQuestion,
            answers,
            questions.length,
            isActive,
            startTime,
            router,
            categoryId
        ]
    )

    // Timer effect
    useEffect(() => {
        if (!isActive || timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Time's up, move to next question or complete quiz
                    if (currentQuestion < questions.length - 1) {
                        setCurrentQuestion((prev) => prev + 1)
                        return 30 // Reset timer
                    } else {
                        setIsActive(false)
                        const timeTaken = Math.floor(
                            (Date.now() - startTime) / 1000
                        )
                        router.push(`/results/${categoryId}?answers=${JSON.stringify(answers)}&timeTaken=${timeTaken}`)
                        return 0
                    }
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [
        timeLeft,
        isActive,
        currentQuestion,
        questions.length,
        answers,
        startTime,
        router,
        categoryId
    ])

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Loading quiz...</div>
            </div>
        )
    }

    if (error || questions.length === 0) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold text-red-600'>
                    Failed to load quiz. Please try again.
                </div>
            </div>
        )
    }

    const currentQ = questions[currentQuestion]

    return (
        <div className='min-h-screen bg-white'>
            {/* Header */}
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-4xl mx-auto px-4 py-4'>
                    <div className='flex items-center justify-between'>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className='flex items-center space-x-2 text-gray-600 hover:text-gray-900'>
                            <ArrowLeft className='w-5 h-5' />
                            <span>Back to Dashboard</span>
                        </button>

                        <div className='flex items-center space-x-4'>
                            <div className='flex items-center space-x-2'>
                                <Clock className='w-5 h-5 text-red-600' />
                                <span className='font-mono text-lg'>
                                    {timeLeft}s
                                </span>
                            </div>
                            <div className='text-sm text-gray-600'>
                                Question {currentQuestion + 1} of{" "}
                                {questions.length}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quiz Content */}
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <div className='bg-white rounded-lg shadow-lg p-8'>
                    {/* Question */}
                    <div className='mb-8'>
                        <MarkdownRenderer
                            content={currentQ.question}
                            className='text-2xl font-bold text-gray-900 mb-4'
                        />
                    </div>

                    {/* Options */}
                    <div className='space-y-4'>
                        {currentQ.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                                    answers[currentQuestion] === index
                                        ? "border-red-600 bg-red-50 text-red-600"
                                        : "border-gray-300 hover:border-gray-400 text-gray-900"
                                }`}>
                                <div className='flex items-start'>
                                    <span className='font-semibold text-red-600 mr-3 mt-1 flex-shrink-0'>
                                        {String.fromCharCode(65 + index)}.
                                    </span>
                                    <div className='flex-1'>
                                        <MarkdownRenderer
                                            content={option}
                                            className='text-left'
                                        />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className='mt-8'>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                                className='bg-red-600 h-2 rounded-full transition-all duration-300'
                                style={{
                                    width: `${
                                        ((currentQuestion + 1) /
                                            questions.length) *
                                        100
                                    }%`
                                }}
                            />
                        </div>
                        <div className='flex justify-between text-sm text-gray-600 mt-2'>
                            <span>Progress</span>
                            <span>
                                {currentQuestion + 1} / {questions.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Quiz() {
    return (
        <ProtectedRoute>
            <QuizContent />
        </ProtectedRoute>
    )
}