import { useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export default function Timer({ timeLeft, totalTime, onTimeUp, isActive }: TimerProps) {
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      onTimeUp();
    }
  }, [timeLeft, isActive, onTimeUp]);

  const percentage = (timeLeft / totalTime) * 100;
  const isUrgent = timeLeft <= 10;
  const isWarning = timeLeft <= 20;

  return (
    <div className="flex items-center space-x-3">
      <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-blue-500'}`} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-medium ${isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-600'}`}>
            Time Left
          </span>
          <span className={`text-sm font-bold ${isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              isUrgent ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}