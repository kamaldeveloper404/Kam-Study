'use client'

import { motion } from 'framer-motion'
import { User, BookOpen, CheckCircle2, Flame, Calendar, TrendingUp } from 'lucide-react'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'

export default function ProfileTab({ userData }: { userData: any }) {
  const { language } = useApp()
  const t = translations[language].profile

  const totalLessons = userData.subjects.reduce((acc: number, subject: any) => 
    acc + subject.lessons.length, 0
  )
  
  const completedLessons = userData.unifiedSchedule?.reduce((acc: number, day: any) => 
    acc + day.lessons.filter((l: any) => l.completed).length, 0
  ) || 0

  // Calculate streak (consecutive days with completed lessons)
  const calculateStreak = () => {
    if (!userData.unifiedSchedule) return 0
    
    let streak = 0
    const today = new Date()
    const startDate = new Date(userData.startDate || today)
    
    for (let i = 0; i < userData.unifiedSchedule.length; i++) {
      const day = userData.unifiedSchedule[i]
      const hasCompleted = day.lessons.some((l: any) => l.completed)
      const allCompleted = day.lessons.every((l: any) => l.completed)
      
      if (allCompleted) {
        streak++
      } else if (hasCompleted) {
        // Partial completion still counts
        streak++
      } else {
        // Check if this day is in the future
        const dayDate = new Date(startDate)
        dayDate.setDate(dayDate.getDate() + i)
        if (dayDate > today) {
          break
        }
        // If it's past and not completed, break streak
        break
      }
    }
    
    return streak
  }

  const streak = calculateStreak()
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Calculate days active
  const startDate = new Date(userData.startDate || new Date())
  const today = new Date()
  const daysActive = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{userData.name}</h2>
        <p className="text-gray-600 dark:text-gray-300">{userData.grade}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{userData.country}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-md p-4 text-center text-white"
        >
          <Flame size={32} className="mx-auto mb-2" />
          <p className="text-3xl font-bold">{streak}</p>
          <p className="text-sm opacity-90">{language === 'ar' ? 'يوم متتالي 🔥' : 'Day Streak 🔥'}</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-md p-4 text-center text-white"
        >
          <TrendingUp size={32} className="mx-auto mb-2" />
          <p className="text-3xl font-bold">{overallProgress}%</p>
          <p className="text-sm opacity-90">{language === 'ar' ? 'التقدم الكلي' : 'Overall Progress'}</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl shadow-md p-4 text-center text-white"
        >
          <CheckCircle2 size={32} className="mx-auto mb-2" />
          <p className="text-3xl font-bold">{completedLessons}</p>
          <p className="text-sm opacity-90">{language === 'ar' ? 'دروس مكتملة' : 'Completed'}</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-md p-4 text-center text-white"
        >
          <Calendar size={32} className="mx-auto mb-2" />
          <p className="text-3xl font-bold">{daysActive}</p>
          <p className="text-sm opacity-90">{language === 'ar' ? 'يوم نشط' : 'Days Active'}</p>
        </motion.div>
      </div>

      {/* Subjects Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen size={24} className="text-primary" />
          {t.subjects}
        </h3>
        <div className="space-y-3">
          {userData.subjects.map((subject: any, index: number) => {
            const subjectLessons = userData.unifiedSchedule?.reduce((acc: number, day: any) => {
              return acc + day.lessons.filter((l: any) => l.subjectName === subject.name).length
            }, 0) || 0
            
            const subjectCompleted = userData.unifiedSchedule?.reduce((acc: number, day: any) => {
              return acc + day.lessons.filter((l: any) => l.subjectName === subject.name && l.completed).length
            }, 0) || 0
            
            const progress = subjectLessons > 0 ? Math.round((subjectCompleted / subjectLessons) * 100) : 0
            
            return (
              <div key={index} className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800 dark:text-white">{subject.name}</h4>
                  <span className="text-sm text-accent font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {subjectCompleted}/{subjectLessons} {language === 'ar' ? 'دروس' : 'lessons'}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
