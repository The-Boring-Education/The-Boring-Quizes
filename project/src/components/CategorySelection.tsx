import { quizCategories } from '../data/questions';
import { QuizCategory } from '../types/quiz';

interface CategorySelectionProps {
  onSelectCategory: (category: QuizCategory) => void;
}

export default function CategorySelection({ onSelectCategory }: CategorySelectionProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black p-4">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <div className="text-3xl font-extrabold mb-10 text-center">Choose a Quiz</div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {quizCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={
                'cursor-pointer rounded-xl border-2 p-6 shadow transition-all duration-150 flex flex-col items-start justify-between h-full border-black bg-white hover:bg-red-50 hover:border-red-600'
              }
            >
              <div className="text-xl font-bold mb-2">{cat.name}</div>
              <div className="text-sm text-gray-700 mb-2 flex-1">{cat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}