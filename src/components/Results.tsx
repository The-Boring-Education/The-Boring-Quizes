import { Question } from "../types/quiz"

interface ResultsProps {
    questions: Question[]
    answers: (number | null)[]
    timeTaken: number
    onRestart: () => void
}

export default function Results({
    questions,
    answers,
    timeTaken,
    onRestart
}: ResultsProps) {
    const score = answers.reduce((acc: number, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-white text-black p-4'>
            <div className='w-full max-w-2xl mx-auto'>
                <div className='text-5xl font-extrabold text-black text-center mb-6'>
                    Quiz Complete
                </div>
                <div className='text-3xl font-bold mb-4 text-center'>
                    You got <span className='text-red-600'>{score}</span> out of{" "}
                    <span className='text-black'>{questions.length}</span>
                </div>

                <div className='text-center mb-8'>
                    <p className='text-gray-600'>
                        Time taken: {Math.floor(timeTaken / 60)}:
                        {String(timeTaken % 60).padStart(2, "0")}
                    </p>
                </div>

                <button
                    onClick={onRestart}
                    className='block mx-auto mb-12 bg-red-600 hover:bg-black text-white font-bold py-3 px-10 rounded-lg text-lg shadow transition-colors duration-150'>
                    Start Quiz Again
                </button>

                <div className='space-y-8'>
                    {questions.map((q, idx) => {
                        const isCorrect = answers[idx] === q.correctAnswer
                        return (
                            <div
                                key={q.id}
                                className={`rounded-xl border-2 ${
                                    isCorrect
                                        ? "border-black"
                                        : "border-red-600"
                                } bg-white p-6 shadow flex flex-col gap-2`}>
                                <div className='text-lg font-semibold mb-2 text-black'>
                                    Q{idx + 1}: {q.question}
                                </div>
                                <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-6 ml-2'>
                                    <div>
                                        Your answer:{" "}
                                        <span
                                            className={
                                                isCorrect
                                                    ? "text-black font-bold"
                                                    : "text-red-600 font-bold"
                                            }>
                                            {answers[idx] !== null ? (
                                                q.options[answers[idx]!]
                                            ) : (
                                                <span className='italic text-black'>
                                                    No answer
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        Correct answer:{" "}
                                        <span className='text-black font-bold'>
                                            {q.options[q.correctAnswer]}
                                        </span>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    {isCorrect ? (
                                        <div className='bg-green-600 text-white rounded-lg px-4 py-2 font-semibold inline-block'>
                                            Nice! Correct!
                                        </div>
                                    ) : (
                                        <div className='bg-red-600 text-white rounded-lg px-4 py-2 font-semibold inline-block'>
                                            Oops! Not quite right!
                                        </div>
                                    )}
                                </div>
                                <div className='mt-2 text-sm bg-gray-100 rounded px-3 py-2 text-black'>
                                    <span className='font-semibold'>
                                        Explanation:
                                    </span>{" "}
                                    {q.explanation}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
