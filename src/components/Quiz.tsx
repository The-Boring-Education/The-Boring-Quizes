import { useState, useEffect } from 'react';
import { Question } from '../types/quiz';

interface QuizProps {
  questions: Question[];
  timePerQuestion: number;
  onComplete: (answers: (number | null)[], timeTaken: number) => void;
}

export default function Quiz({ questions, timePerQuestion, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext(null);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(timePerQuestion);
  }, [currentQuestion, timePerQuestion]);

  const handleNext = (answerIndex: number | null) => {
    const newAnswers = [...answers];
    if (answerIndex !== null) newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      onComplete(newAnswers, timeTaken);
    }
  };

  const q = questions[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-0 flex flex-col items-center">
        <div className="w-full text-center font-extrabold leading-snug break-words mb-8 text-3xl md:text-4xl" style={{wordBreak: 'break-word'}}>
          {q.question}
        </div>
        <div className="w-full flex flex-col gap-3 mb-6">
          {q.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleNext(idx)}
              className="w-full border-2 border-black rounded-lg py-3 px-4 text-left font-medium text-black bg-white hover:bg-red-50 focus:bg-red-100 focus:outline-none transition-colors duration-150 text-base md:text-lg"
            >
              <span className="font-bold text-red-600 mr-2">{String.fromCharCode(65 + idx)}.</span> {option}
            </button>
          ))}
        </div>
        <div className="w-full flex flex-col items-center mt-2 mb-4">
          <div className="text-base font-semibold text-black text-center mb-1">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="text-black font-mono text-sm">Time left: <span className="text-red-600">{timeLeft}s</span></div>
        </div>
      </div>
    </div>
  );
}