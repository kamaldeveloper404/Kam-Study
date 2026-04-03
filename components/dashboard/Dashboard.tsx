'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Home, User, Settings, RefreshCw } from 'lucide-react'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'
import AnimatedBackground from '@/components/AnimatedBackground'
import Timeline from './Timeline'
import FocusMode from './FocusMode'
import ProfileTab from './ProfileTab'
import SettingsTab from './SettingsTab'

export interface LessonType {
  name: string
  subjectName: string
  type: 'study' | 'practice'
  completed: boolean
  originalLesson?: string
  practiceGap?: number
}

interface ActiveLessonType extends LessonType {
  dayIndex: number
  lessonIndex: number
}

export default function Dashboard({ userData }: { userData: any }) {
  const [data, setData] = useState(userData)
  const [activeLesson, setActiveLesson] = useState<ActiveLessonType | null>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'settings'>('home')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showOutdatedWarning, setShowOutdatedWarning] = useState(false)
  const { language, playSound } = useApp()
  const t = translations[language].dashboard
  const nav = translations[language].nav

  useEffect(() => {
    const saved = localStorage.getItem('studyFlowData')
    if (saved) {
      const parsedData = JSON.parse(saved)
      setData(parsedData)
      
      // Check if plan is outdated (more than 3 days behind)
      const startDate = new Date(parsedData.startDate || new Date())
      const today = new Date()
      const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      const schedule = parsedData.unifiedSchedule || []
      const currentDay = schedule.findIndex((day: any) => 
        day.lessons.some((l: any) => !l.completed)
      )
      
      // If we're more than 3 days behind schedule, show warning
      if (currentDay >= 0 && daysPassed > currentDay + 3) {
        setShowOutdatedWarning(true)
      }
    }
  }, [])

  const updateProgress = (dayIndex: number, lessonIndex: number) => {
    const updated = { ...data }
    updated.unifiedSchedule[dayIndex].lessons[lessonIndex].completed = true
    setData(updated)
    localStorage.setItem('studyFlowData', JSON.stringify(updated))
  }

  const handleResetPlan = () => {
    playSound('click')
    setShowResetConfirm(true)
  }

  const confirmReset = () => {
    playSound('success')
    
    // Keep the same data but rebuild the schedule from today
    const updatedData = { ...data }
    
    // Reset all completion status
    if (updatedData.unifiedSchedule) {
      updatedData.unifiedSchedule.forEach((day: any) => {
        day.lessons.forEach((lesson: any) => {
          lesson.completed = false
        })
      })
    }
    
    // Rebuild schedule with same subjects
    const newSchedule = rebuildSchedule(updatedData.subjects, updatedData.planType)
    updatedData.unifiedSchedule = newSchedule
    updatedData.startDate = new Date().toISOString()
    
    setData(updatedData)
    localStorage.setItem('studyFlowData', JSON.stringify(updatedData))
    setShowResetConfirm(false)
    
    // Reload to refresh everything
    window.location.reload()
  }

  const rebuildSchedule = (subjects: any[], planType: 'term' | 'revision') => {
    // Find the earliest exam date and longest revision period
    let minExamDate = new Date(subjects[0].examDate)
    let maxRevisionDays = subjects[0].revisionDays
    
    subjects.forEach((subject: any) => {
      const examDate = new Date(subject.examDate)
      if (examDate < minExamDate) minExamDate = examDate
      if (subject.revisionDays > maxRevisionDays) maxRevisionDays = subject.revisionDays
    })
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    minExamDate.setHours(0, 0, 0, 0)
    const totalDays = Math.floor((minExamDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const availableDays = Math.max(1, totalDays - maxRevisionDays)
    
    if (planType === 'revision') {
      return createRevisionSchedule(subjects, availableDays)
    } else {
      return createTermSchedule(subjects, availableDays)
    }
  }

  const createRevisionSchedule = (subjects: any[], availableDays: number) => {
    const allLessons: any[] = []
    subjects.forEach((subject: any) => {
      subject.lessons.forEach((lesson: string) => {
        allLessons.push({
          name: lesson,
          subjectName: subject.name,
          type: 'study',
          completed: false
        })
      })
    })
    
    const totalLessons = allLessons.length
    const lessonsPerDay = Math.floor(totalLessons / availableDays)
    const extraLessons = totalLessons % availableDays
    
    const schedule = []
    const lessonsBySubject: any[][] = subjects.map((subject: any) => 
      subject.lessons.map((lesson: string) => ({
        name: lesson,
        subjectName: subject.name,
        type: 'study',
        completed: false
      }))
    )
    
    let subjectIndex = 0
    
    for (let day = 0; day < availableDays; day++) {
      const lessonsForThisDay = day < extraLessons ? lessonsPerDay + 1 : lessonsPerDay
      const dayLessons: any[] = []
      
      let addedLessons = 0
      let attempts = 0
      const maxAttempts = subjects.length * 10
      
      while (addedLessons < lessonsForThisDay && attempts < maxAttempts) {
        const idx = subjectIndex % subjects.length
        
        if (lessonsBySubject[idx].length > 0) {
          const lesson = lessonsBySubject[idx].shift()
          dayLessons.push(lesson)
          addedLessons++
        }
        
        subjectIndex++
        attempts++
      }
      
      if (dayLessons.length > 0) {
        schedule.push({
          day: day + 1,
          lessons: dayLessons
        })
      }
    }
    
    return schedule
  }

  const createTermSchedule = (subjects: any[], availableDays: number) => {
    const allStudyLessons: any[] = []
    subjects.forEach((subject: any) => {
      subject.lessons.forEach((lesson: string) => {
        allStudyLessons.push({
          name: lesson,
          subjectName: subject.name,
          type: 'study',
          completed: false,
          practiceGap: subject.practiceGap || 0
        })
      })
    })
    
    const totalDaysNeeded = allStudyLessons.reduce((sum: number, lesson: any) => 
      sum + 1 + lesson.practiceGap, 0
    )
    
    if (totalDaysNeeded <= availableDays) {
      return createTermScheduleWithGaps(allStudyLessons, availableDays)
    }
    
    return createCompressedTermSchedule(allStudyLessons, availableDays)
  }

  const createTermScheduleWithGaps = (studyLessons: any[], availableDays: number) => {
    const schedule: any[] = []
    let currentDay = 0
    const practiceQueue: any[] = []
    
    for (let i = 0; i < studyLessons.length && currentDay < availableDays; i++) {
      const lesson = studyLessons[i]
      
      if (currentDay < availableDays) {
        schedule.push({
          day: currentDay + 1,
          lessons: [{
            name: lesson.name,
            subjectName: lesson.subjectName,
            type: 'study',
            completed: false
          }]
        })
        currentDay++
        
        if (lesson.practiceGap > 0) {
          for (let p = 0; p < lesson.practiceGap; p++) {
            practiceQueue.push({
              name: `حل على: ${lesson.name}`,
              subjectName: lesson.subjectName,
              type: 'practice',
              originalLesson: lesson.name,
              completed: false
            })
          }
        }
      }
    }
    
    while (practiceQueue.length > 0 && currentDay < availableDays) {
      schedule.push({
        day: currentDay + 1,
        lessons: [practiceQueue.shift()]
      })
      currentDay++
    }
    
    return schedule
  }

  const createCompressedTermSchedule = (studyLessons: any[], availableDays: number) => {
    const schedule: any[] = []
    const practiceQueue: any[] = []
    
    const lessonsPerDay = Math.ceil(studyLessons.length / availableDays)
    let lessonIndex = 0
    
    for (let day = 0; day < availableDays; day++) {
      const dayLessons: any[] = []
      
      const lessonsToAdd = Math.min(lessonsPerDay, studyLessons.length - lessonIndex)
      for (let i = 0; i < lessonsToAdd && lessonIndex < studyLessons.length; i++) {
        const lesson = studyLessons[lessonIndex]
        
        dayLessons.push({
          name: lesson.name,
          subjectName: lesson.subjectName,
          type: 'study',
          completed: false
        })
        
        if (lesson.practiceGap > 0) {
          practiceQueue.push({
            name: `حل على: ${lesson.name}`,
            subjectName: lesson.subjectName,
            type: 'practice',
            originalLesson: lesson.name,
            completed: false
          })
        }
        
        lessonIndex++
      }
      
      const practiceToAdd = Math.min(2, practiceQueue.length)
      for (let i = 0; i < practiceToAdd; i++) {
        dayLessons.push(practiceQueue.shift())
      }
      
      if (dayLessons.length > 0) {
        schedule.push({
          day: day + 1,
          lessons: dayLessons
        })
      }
    }
    
    return schedule
  }

  const schedule = data.unifiedSchedule || []
  
  // Calculate overall progress
  const totalLessons = schedule.reduce((acc: number, day: any) => acc + day.lessons.length, 0)
  const completedLessons = schedule.reduce((acc: number, day: any) => 
    acc + day.lessons.filter((l: any) => l.completed).length, 0
  )
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Find nearest exam date
  const examDates = data.subjects.map((s: any) => new Date(s.examDate))
  const nearestExam = new Date(Math.min(...examDates.map((d: Date) => d.getTime())))
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  nearestExam.setHours(0, 0, 0, 0)
  const daysLeft = Math.max(0, Math.ceil((nearestExam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  if (activeLesson) {
    return <FocusMode lesson={activeLesson} onComplete={() => {
      updateProgress(activeLesson.dayIndex, activeLesson.lessonIndex)
      setActiveLesson(null)
    }} onClose={() => setActiveLesson(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 pb-20 relative">
      <AnimatedBackground />
      
      <div className="max-w-2xl mx-auto p-6 relative z-10">
        {activeTab === 'home' && (
          <>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t.hello} {data.name} 👋</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {data.subjects.map((s: any) => s.name).join(' • ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetPlan}
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-3 rounded-full shadow-md hover:scale-110 transition-transform"
                  title={language === 'ar' ? 'إعادة رسم الخطة' : 'Reset Plan'}
                >
                  <RefreshCw size={20} />
                </button>
                <div className="bg-accent text-white p-3 rounded-full">
                  <Trophy size={24} />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
              >
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{t.daysLeft}</p>
                <p className="text-3xl font-bold text-primary">{daysLeft} {language === 'ar' ? 'يوم' : t.day}</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
              >
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{t.progress}</p>
                <p className="text-3xl font-bold text-accent">{progress}%</p>
              </motion.div>
            </div>

            <Timeline 
              schedule={schedule} 
              onLessonClick={(dayIndex: number, lessonIndex: number, lesson: LessonType) => {
                setActiveLesson({ dayIndex, lessonIndex, ...lesson })
              }} 
            />
          </>
        )}

        {activeTab === 'profile' && <ProfileTab userData={data} />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {language === 'ar' ? '🔄 إعادة رسم الخطة' : '🔄 Rebuild Plan'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {language === 'ar' 
                ? 'هيتم إعادة حساب الجدول من النهاردة بنفس المواد والدروس. التقدم الحالي هيتحذف. متأكد؟'
                : 'The schedule will be recalculated from today with the same subjects and lessons. Current progress will be reset. Are you sure?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResetConfirm(false)
                  playSound('click')
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
              >
                {language === 'ar' ? 'نعم، أعد الرسم' : 'Yes, Rebuild'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Outdated Plan Warning */}
      {showOutdatedWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {language === 'ar' ? '📅 الخطة متأخرة!' : '📅 Plan is Outdated!'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {language === 'ar' 
                ? 'يبدو إنك متأخر عن الجدول. عايز تعيد رسم الخطة من النهاردة؟'
                : 'It seems you are behind schedule. Would you like to reset the plan from today?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOutdatedWarning(false)
                  playSound('click')
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                {language === 'ar' ? 'لا، أكمل الخطة القديمة' : 'No, Continue Old Plan'}
              </button>
              <button
                onClick={() => {
                  setShowOutdatedWarning(false)
                  confirmReset()
                }}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
              >
                {language === 'ar' ? 'نعم، أعد الرسم' : 'Yes, Reset Plan'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 z-20">
        <div className="max-w-2xl mx-auto flex justify-around">
          <button 
            onClick={() => {
              setActiveTab('home')
              playSound('click')
            }}
            className={`flex flex-col items-center ${activeTab === 'home' ? 'text-primary' : 'text-gray-400'}`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">{nav.home}</span>
          </button>
          <button 
            onClick={() => {
              setActiveTab('profile')
              playSound('click')
            }}
            className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-primary' : 'text-gray-400'}`}
          >
            <User size={24} />
            <span className="text-xs mt-1">{nav.profile}</span>
          </button>
          <button 
            onClick={() => {
              setActiveTab('settings')
              playSound('click')
            }}
            className={`flex flex-col items-center ${activeTab === 'settings' ? 'text-primary' : 'text-gray-400'}`}
          >
            <Settings size={24} />
            <span className="text-xs mt-1">{nav.settings}</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
