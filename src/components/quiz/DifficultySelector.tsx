'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { 
  Zap, 
  Target, 
  Flame, 
  Sparkles, 
  Clock,
  Brain,
  TrendingUp 
} from "lucide-react"

interface DifficultySelectorProps {
  selectedDifficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard' | 'mixed') => void
  questionCount: number
  onQuestionCountChange: (count: number) => void
}

interface DifficultyOption {
  id: 'easy' | 'medium' | 'hard' | 'mixed'
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
  borderColor: string
  timeEstimate: string
  features: string[]
}

const difficultyOptions: DifficultyOption[] = [
  {
    id: 'easy',
    name: 'Easy',
    description: 'Perfect for beginners and quick review',
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200 hover:border-green-400',
    timeEstimate: '5-8 min',
    features: ['Basic concepts', 'Clear explanations', 'Confidence building']
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Balanced challenge for steady learning',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200 hover:border-blue-400',
    timeEstimate: '8-12 min',
    features: ['Mixed concepts', 'Moderate difficulty', 'Skill development']
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'Advanced questions for experts',
    icon: Flame,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200 hover:border-red-400',
    timeEstimate: '12-20 min',
    features: ['Complex scenarios', 'Deep thinking', 'Mastery testing']
  },
  {
    id: 'mixed',
    name: 'Adaptive',
    description: 'AI-powered difficulty that adapts to you',
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200 hover:border-purple-400',
    timeEstimate: '10-15 min',
    features: ['Smart selection', 'Personalized', 'Optimal learning']
  }
]

export function DifficultySelector({
  selectedDifficulty,
  onDifficultyChange,
  questionCount,
  onQuestionCountChange
}: DifficultySelectorProps) {
  const selectedOption = difficultyOptions.find(opt => opt.id === selectedDifficulty)!

  return (
    <div className="space-y-6">
      {/* Difficulty Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Choose Your Challenge Level
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {difficultyOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedDifficulty === option.id
            
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 ${option.borderColor} ${
                  isSelected 
                    ? `${option.bgColor} border-2 shadow-lg scale-105` 
                    : 'bg-white border hover:shadow-md'
                }`}
                onClick={() => onDifficultyChange(option.id)}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <Icon className={`h-8 w-8 mx-auto ${option.color}`} />
                    <h4 className="font-semibold text-gray-900">{option.name}</h4>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    
                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{option.timeEstimate}</span>
                    </div>
                    
                    {isSelected && (
                      <Badge className={`${option.color} ${option.bgColor} border-0 mt-2`}>
                        Selected
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {/* Selected difficulty details */}
        {selectedOption && (
          <div className={`mt-4 p-4 rounded-lg ${selectedOption.bgColor} border ${selectedOption.borderColor.split(' ')[0]}`}>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <selectedOption.icon className={`h-4 w-4 mr-2 ${selectedOption.color}`} />
              {selectedOption.name} Mode Features:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedOption.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question Count Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Number of Questions: {questionCount}
        </h3>
        
        <div className="bg-white p-6 rounded-lg border">
          <div className="space-y-4">
            <Slider
              value={[questionCount]}
              onValueChange={(value) => onQuestionCountChange(value[0])}
              max={30}
              min={5}
              step={5}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>5 questions</span>
              <span>15 questions</span>
              <span>30 questions</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">Quick</div>
                <div className="text-xs text-gray-600">5-10 questions</div>
                <div className="text-xs text-gray-500">3-6 minutes</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">Standard</div>
                <div className="text-xs text-gray-600">10-20 questions</div>
                <div className="text-xs text-gray-500">8-15 minutes</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">Deep Dive</div>
                <div className="text-xs text-gray-600">20-30 questions</div>
                <div className="text-xs text-gray-500">15-25 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Selection Buttons */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Quick Presets:</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDifficultyChange('easy')
              onQuestionCountChange(10)
            }}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            Easy Review (10)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDifficultyChange('medium')
              onQuestionCountChange(15)
            }}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Balanced Practice (15)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDifficultyChange('hard')
              onQuestionCountChange(10)
            }}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Challenge Mode (10)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDifficultyChange('mixed')
              onQuestionCountChange(20)
            }}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            AI Adaptive (20)
          </Button>
        </div>
      </div>
    </div>
  )
}