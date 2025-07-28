import { useState } from "react"
import Landing from "./components/Landing"
import CategorySelection from "./components/CategorySelection"
import Quiz from "./components/Quiz"
import Results from "./components/Results"
import Login from "./components/Login"
import UserDashboard from "./components/UserDashboard"
import { QuizCategory } from "./types/quiz"
import { useAuth } from "./contexts/AuthContext"
import { quizApi } from "./services/api"
import { User, LogOut } from "lucide-react"

function App() {
    const { user, loading, signOut } = useAuth()
    const [showLanding, setShowLanding] = useState(true)
    const [showDashboard, setShowDashboard] = useState(false)
    const [selectedCategory, setSelectedCategory] =
        useState<QuizCategory | null>(null)
    const [quizResults, setQuizResults] = useState<{
        answers: (number | null)[]
        timeTaken: number
    } | null>(null)
    const [quizKey, setQuizKey] = useState(0) // for resetting quiz

    const handleSelectCategory = async (category: QuizCategory) => {
        // Load questions from API for the selected category
        try {
            const response = await quizApi.getQuestions(category.id)
            const quizData = response.data?.data
            if (quizData && quizData.questions) {
                setSelectedCategory({
                    ...category,
                    questions: quizData.questions.map(
                        (q: {
                            _id?: string
                            question: string
                            options: string[]
                            correctAnswer: number
                            explanation: string
                            detailedExplanation?: string
                            difficulty: string
                        }) => ({
                            id: q._id || Math.random(),
                            question: q.question,
                            options: q.options,
                            correctAnswer: q.correctAnswer,
                            explanation: q.explanation,
                            detailedExplanation:
                                q.detailedExplanation || q.explanation,
                            category: category.name,
                            difficulty: q.difficulty
                        })
                    )
                })
                setQuizResults(null)
                setQuizKey((prev) => prev + 1)
            }
        } catch (error) {
            console.error("Failed to load questions:", error)
            // Handle error - maybe show an alert
        }
    }

    const handleQuizComplete = (
        answers: (number | null)[],
        timeTaken: number
    ) => {
        setQuizResults({ answers, timeTaken })
    }

    const handleGetStarted = () => {
        setShowLanding(false)
    }

    const handleRestart = () => {
        setShowLanding(true)
        setSelectedCategory(null)
        setQuizResults(null)
        setQuizKey((prev) => prev + 1)
    }

    // Show loading state
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-2xl font-semibold'>Loading...</div>
            </div>
        )
    }

    // Show login if not authenticated
    if (!user) {
        return <Login />
    }

    // User controls component
    const UserControls = () => (
        <div className='fixed top-4 right-4 flex items-center space-x-4 z-40'>
            <button
                onClick={() => setShowDashboard(true)}
                className='flex items-center space-x-2 bg-white border-2 border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors'>
                <User className='w-4 h-4' />
                <span className='font-medium'>{user.name}</span>
            </button>
            <button
                onClick={signOut}
                className='flex items-center space-x-2 bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition-colors'>
                <LogOut className='w-4 h-4' />
                <span>Sign Out</span>
            </button>
        </div>
    )

    return (
        <>
            <UserControls />
            {showDashboard && (
                <UserDashboard onClose={() => setShowDashboard(false)} />
            )}

            {showLanding && <Landing onGetStarted={handleGetStarted} />}

            {!showLanding && !selectedCategory && (
                <CategorySelection onSelectCategory={handleSelectCategory} />
            )}

            {!showLanding && selectedCategory && !quizResults && (
                <Quiz
                    key={quizKey}
                    questions={selectedCategory.questions}
                    categoryId={selectedCategory.id}
                    timePerQuestion={30}
                    onComplete={handleQuizComplete}
                />
            )}

            {!showLanding && selectedCategory && quizResults && (
                <Results
                    questions={selectedCategory.questions}
                    answers={quizResults.answers}
                    timeTaken={quizResults.timeTaken}
                    onRestart={handleRestart}
                />
            )}
        </>
    )
}

export default App
