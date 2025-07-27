import { useState } from 'react';
import CategorySelection from './components/CategorySelection';
import Quiz from './components/Quiz';
import Results from './components/Results';
import { QuizCategory } from './types/quiz';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [quizResults, setQuizResults] = useState<{ answers: (number | null)[]; timeTaken: number } | null>(null);
  const [quizKey, setQuizKey] = useState(0); // for resetting quiz

  const handleSelectCategory = (category: QuizCategory) => {
    setSelectedCategory(category);
    setQuizResults(null);
    setQuizKey(prev => prev + 1);
  };

  const handleQuizComplete = (answers: (number | null)[], timeTaken: number) => {
    setQuizResults({ answers, timeTaken });
  };

  const handleRestart = () => {
    setSelectedCategory(null);
    setQuizResults(null);
    setQuizKey(prev => prev + 1);
  };

  if (!selectedCategory) {
    return <CategorySelection onSelectCategory={handleSelectCategory} />;
  }

  if (!quizResults) {
    return (
      <Quiz
        key={quizKey}
        questions={selectedCategory.questions}
        timePerQuestion={30}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <Results
      questions={selectedCategory.questions}
      answers={quizResults.answers}
      timeTaken={quizResults.timeTaken}
      onRestart={handleRestart}
    />
  );
}

export default App;