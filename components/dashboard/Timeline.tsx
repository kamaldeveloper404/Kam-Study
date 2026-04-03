'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, BookOpen, PenTool } from 'lucide-react'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'
import { LessonType } from './Dashboard'

interface TimelineProps {
  schedule: Array<{
    day: number
    lessons: LessonType[]
  }>
  onLessonClick: (dayIndex: number, lessonIndex: number, lesson: LessonType) => void
}

export default function Timeline({ schedule, onLessonClick }: TimelineProps) {
  const { language } = useApp()
  const t = translations[language].dashboard
  
  const today = new Date()
  const currentDay = schedule.findIndex((day: any) => 
    day.lessons.some((l: any) => !l.completed)
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">{t.plan}</h2>
      
      <div className="relative">
        <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        
        {schedule.map((day: any, dayIndex: number) => {
          const isToday = dayIndex === currentDay
          const isPast = dayIndex < currentDay
          const isFuture = dayIndex > currentDay
          
          return (
            <motion.div
              key={dayIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="relative mb-8 last:mb-0"
            >
              <div className="flex items-start gap-4">
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  isToday ? 'bg-accent text-white' : isPast ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {dayIndex + 1}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {language === 'ar' ? `اليوم ${dayIndex + 1}` : `Day ${dayIndex + 1}`}
                    </h3>
                    {isToday && <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">{t.active}</span>}
                  </div>
                  
                  <div className="space-y-2">
                    {day.lessons.map((lesson: any, lessonIndex: number) => {
                      const canAccess = !isFuture || isPast
                      const isStudy = lesson.type === 'study'
                      const isPractice = lesson.type === 'practice'
                      
                      return (
                        <button
                          key={lessonIndex}
                          onClick={() => canAccess && !lesson.completed && onLessonClick(dayIndex, lessonIndex, lesson)}
                          disabled={!canAccess || lesson.completed}
                          className={`w-full text-right p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                            lesson.completed 
                              ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300' 
                              : canAccess 
                                ? isPractice
                                  ? 'border-accent bg-amber-50 dark:bg-amber-900 hover:bg-amber-100 dark:hover:bg-amber-800 cursor-pointer'
                                  : 'border-primary bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                          ) : isPractice ? (
                            <PenTool size={20} className={canAccess ? 'text-accent' : 'text-gray-400'} />
                          ) : (
                            <BookOpen size={20} className={canAccess ? 'text-primary' : 'text-gray-400'} />
                          )}
                          <div className="flex-1 text-right">
                            <div className="font-medium">{lesson.name}</div>
                            <div className="text-xs opacity-75 flex items-center gap-2 justify-end">
                              <span>{lesson.subjectName}</span>
                              {isPractice && (
                                <span className="bg-accent text-white px-2 py-0.5 rounded-full text-xs">
                                  {t.practice}
                                </span>
                              )}
                              {isStudy && (
                                <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs">
                                  {t.study}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
