import { useState } from 'react';
import { Play, Clock, Target, Brain, Settings } from 'lucide-react';

interface StartScreenProps {
  onStart: (timePerQuestion: number) => void;
  onSelectCategory: () => void;
  totalQuestions: number;
  categoryName?: string;
}

export default function StartScreen({ onStart, onSelectCategory, totalQuestions, categoryName }: StartScreenProps) {
  const [selectedTime, setSelectedTime] = useState(30);

  const timeOptions = [
    { value: 30, label: '30 seconds', description: 'Quick pace' },
    { value: 60, label: '60 seconds', description: 'Standard pace' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryName ? `${categoryName} Quiz` : 'Interview Prep Quiz'}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {categoryName 
              ? `Focus on ${categoryName.toLowerCase()} with ${totalQuestions} specialized questions.`
              : `Test your programming knowledge with ${totalQuestions} carefully crafted questions.`
            } Perfect for preparing for technical interviews!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {totalQuestions} Questions
              </h3>
              <p className="text-gray-600 text-sm">
                Covering JavaScript, React, algorithms, and more
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Timed Questions
              </h3>
              <p className="text-gray-600 text-sm">
                Choose your preferred time per question
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Detailed Feedback
              </h3>
              <p className="text-gray-600 text-sm">
                Get explanations for every answer
              </p>
            </div>
          </div>

          <div className="border-t pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Quiz Settings</h3>
            </div>
            
            <div className="space-y-4 mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Time per question:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedTime(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedTime === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                      <Clock className={`w-5 h-5 ${
                        selectedTime === option.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onStart(selectedTime)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-3"
            >
              <Play className="w-6 h-6" />
              <span>Start Quiz</span>
            </button>
            
            {categoryName && (
              <button
                onClick={onSelectCategory}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-8 rounded-lg font-medium transition-colors duration-200"
              >
                Choose Different Category
              </button>
            )}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>Good luck! Remember to read each question carefully.</p>
        </div>
      </div>
    </div>
  );
}