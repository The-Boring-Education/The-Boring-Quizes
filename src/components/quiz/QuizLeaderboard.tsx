'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown,
  TrendingUp,
  Target,
  Users,
  RefreshCw
} from "lucide-react"

interface LeaderboardEntry {
  userId: string
  userName: string
  userImage?: string
  categoryName: string
  totalScore: number
  totalAttempts: number
  averageScore: number
  bestStreak: number
  rank: number
  badgeLevel: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface QuizLeaderboardProps {
  categoryName: string
}

export function QuizLeaderboard({ categoryName }: QuizLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRank, setUserRank] = useState<number | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [categoryName])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/v1/quiz/leaderboard?categoryName=${encodeURIComponent(categoryName)}`)
      const result = await response.json()

      if (result.success) {
        setLeaderboard(result.data)
        
        // Find current user's rank
        const userId = localStorage.getItem('userId') || 'demo-user'
        const userEntry = result.data.find((entry: LeaderboardEntry) => entry.userId === userId)
        setUserRank(userEntry ? userEntry.rank : null)
      } else {
        setError(result.error || 'Failed to fetch leaderboard')
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      setError('Failed to fetch leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const getBadgeConfig = (level: string) => {
    switch (level) {
      case 'platinum':
        return { 
          color: 'bg-purple-100 text-purple-800 border-purple-200', 
          icon: Crown,
          label: 'Platinum'
        }
      case 'gold':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          icon: Trophy,
          label: 'Gold'
        }
      case 'silver':
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: Medal,
          label: 'Silver'
        }
      default:
        return { 
          color: 'bg-orange-100 text-orange-800 border-orange-200', 
          icon: Award,
          label: 'Bronze'
        }
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
            {rank}
          </div>
        )
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-2">Failed to load leaderboard</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchLeaderboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </CardContent>
      </Card>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Rankings Yet</h3>
          <p className="text-gray-600">Be the first to complete quizzes and claim the top spot!</p>
        </CardContent>
      </Card>
    )
  }

  const topThree = leaderboard.slice(0, 3)
  const restOfLeaderboard = leaderboard.slice(3, 20) // Show top 20

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Leaderboard
          </h3>
          <p className="text-sm text-gray-600">{categoryName}</p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {leaderboard.length} players
          </div>
          {userRank && (
            <Badge variant="outline" className="text-blue-600">
              Your Rank: #{userRank}
            </Badge>
          )}
        </div>
      </div>

      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">🏆 Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topThree.map((entry) => {
              const badge = getBadgeConfig(entry.badgeLevel)
              const BadgeIcon = badge.icon
              
              return (
                <div 
                  key={entry.userId} 
                  className={`text-center p-6 rounded-lg border-2 ${
                    entry.rank === 1 
                      ? 'border-yellow-200 bg-gradient-to-b from-yellow-50 to-yellow-100' 
                      : entry.rank === 2
                      ? 'border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100'
                      : 'border-orange-200 bg-gradient-to-b from-orange-50 to-orange-100'
                  }`}
                >
                  <div className="relative mb-4">
                    <Avatar className="h-16 w-16 mx-auto">
                      <AvatarImage src={entry.userImage} alt={entry.userName} />
                      <AvatarFallback className="text-lg font-medium">
                        {getInitials(entry.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      {getRankIcon(entry.rank)}
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1">{entry.userName}</h4>
                  
                  <Badge className={`${badge.color} border mb-3`}>
                    <BadgeIcon className="h-3 w-3 mr-1" />
                    {badge.label}
                  </Badge>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Score:</span>
                      <span className="font-medium">{entry.totalScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average:</span>
                      <span className="font-medium">{entry.averageScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attempts:</span>
                      <span className="font-medium">{entry.totalAttempts}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rest of Leaderboard */}
      {restOfLeaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {restOfLeaderboard.map((entry) => {
                const badge = getBadgeConfig(entry.badgeLevel)
                const BadgeIcon = badge.icon
                const isCurrentUser = entry.userId === (localStorage.getItem('userId') || 'demo-user')
                
                return (
                  <div 
                    key={entry.userId}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors ${
                      isCurrentUser 
                        ? 'border-blue-200 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getRankIcon(entry.rank)}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={entry.userImage} alt={entry.userName} />
                        <AvatarFallback className="text-sm">
                          {getInitials(entry.userName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{entry.userName}</h4>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-blue-600 text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.totalAttempts} attempts
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{entry.totalScore}%</div>
                      <div className="text-sm text-gray-600">best score</div>
                    </div>
                    
                    <Badge className={`${badge.color} border`}>
                      <BadgeIcon className="h-3 w-3 mr-1" />
                      {badge.label}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {topThree[0]?.totalScore || 0}%
            </div>
            <div className="text-sm text-gray-600">Top Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(leaderboard.reduce((sum, entry) => sum + entry.averageScore, 0) / leaderboard.length) || 0}%
            </div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{leaderboard.length}</div>
            <div className="text-sm text-gray-600">Total Players</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Crown className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {leaderboard.filter(e => e.badgeLevel === 'platinum').length}
            </div>
            <div className="text-sm text-gray-600">Platinum</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}