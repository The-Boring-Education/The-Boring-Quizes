import { Question as QuestionType } from "../types/quiz"

interface QuestionProps {
    question: QuestionType
    selectedAnswer: number | null
    onAnswerSelect: (answerIndex: number) => void
    currentQuestionIndex: number
    totalQuestions: number
    showResult?: boolean
}

export default function Question({
    question,
    selectedAnswer,
    onAnswerSelect,
    showResult = false
}: QuestionProps) {
    const getOptionClass = (index: number) => {
        const base =
            "w-full p-4 text-left border-2 rounded-lg transition-all duration-200"
        if (showResult) {
            if (index === question.correctAnswer)
                return `${base} border-black bg-white text-black font-bold`
            if (index === selectedAnswer && index !== question.correctAnswer)
                return `${base} border-red-600 bg-red-50 text-red-600`
            return `${base} border-black text-black`
        }
        if (selectedAnswer === index)
            return `${base} border-red-600 bg-red-50 text-red-600`
        return `${base} border-black text-black hover:bg-red-50`
    }

    return (
        <div className='w-full'>
            <div className='mb-6 text-sm font-bold text-black text-center'>
                {/* No question number or category, keep minimal */}
            </div>
            <div className='mb-8 text-2xl font-bold text-center text-black'>
                {question.question}
            </div>
            <div className='space-y-4 mb-8'>
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => !showResult && onAnswerSelect(index)}
                        className={getOptionClass(index)}
                        disabled={showResult}>
                        <span className='font-bold text-red-600 mr-2'>
                            {String.fromCharCode(65 + index)}.
                        </span>{" "}
                        {option}
                    </button>
                ))}
            </div>
        </div>
    )
}
