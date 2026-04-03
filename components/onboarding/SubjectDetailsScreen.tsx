'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Calendar, ArrowRight } from 'lucide-react'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function SubjectDetailsScreen({ 
  subjectIndex, 
  totalSubjects,
  planType,
  onNext,
  onBack
}: { 
  subjectIndex: number
  totalSubjects: number
  planType: 'term' | 'revision'
  onNext: (data: any) => void
  onBack?: () => void
}) {
  const [subjectName, setSubjectName] = useState('')
  const [lessons, setLessons] = useState<string[]>([])
  const [currentLesson, setCurrentLesson] = useState('')
  const [examDate, setExamDate] = useState('')
  const [practiceGap, setPracticeGap] = useState(1)
  const [buttonClicked, setButtonClicked] = useState(false)
  const { language, playSound } = useApp()
  const t = translations[language].subjectDetails

  // Clear form when moving to next subject (keep only exam date and practiceGap)
  useEffect(() => {
    if (subjectIndex > 0) {
      setSubjectName('')
      setLessons([])
      setCurrentLesson('')
      // Keep examDate and practiceGap
    }
  }, [subjectIndex])

  const addLesson = () => {
    if (currentLesson.trim()) {
      setLessons([...lessons, currentLesson.trim()])
      setCurrentLesson('')
      playSound('click')
    }
  }

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index))
    playSound('click')
  }

  const handleNext = () => {
    if (subjectName.trim() && lessons.length > 0 && examDate) {
      playSound('success')
      setButtonClicked(true)
      
      setTimeout(() => {
        onNext({
          name: subjectName.trim(),
          lessons,
          examDate,
          practiceGap: planType === 'term' ? practiceGap : 0
        })
        setButtonClicked(false)
      }, 300)
    }
  }

  const handleBack = () => {
    if (onBack) {
      playSound('click')
      onBack()
    }
  }

  const isValid = subjectName.trim() && lessons.length > 0 && examDate

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 relative">
      <AnimatedBackground />
      
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {t.title} {subjectIndex + 1}/{totalSubjects}
          </h1>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((subjectIndex + 1) / totalSubjects) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">{t.subjectName}</label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder={t.placeholder}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:border-primary focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">الدروس ({lessons.length})</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentLesson}
              onChange={(e) => setCurrentLesson(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addLesson()}
              placeholder={t.lessonPlaceholder}
              className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:border-primary focus:outline-none"
            />
            <button
              onClick={addLesson}
              className="bg-primary text-white p-3 rounded-xl hover:bg-blue-600 transition-all"
            >
              <Plus size={24} />
            </button>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {lessons.map((lesson, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-between bg-blue-50 dark:bg-blue-900 p-3 rounded-xl"
              >
                <span className="text-gray-800 dark:text-white">{lesson}</span>
                <button
                  onClick={() => removeLesson(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">{t.examDate}</label>
          <div className="relative">
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:border-primary focus:outline-none"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        <div className="flex gap-3">
          {subjectIndex > 0 && onBack && (
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight size={20} />
              {language === 'ar' ? 'رجوع' : 'Back'}
            </button>
          )}
          
          <motion.button
            onClick={handleNext}
            disabled={!isValid}
            animate={buttonClicked ? {
              scale: [1, 0.95, 1.05, 1],
              backgroundColor: subjectIndex === totalSubjects - 1 ? ['#f59e0b', '#ea580c', '#f59e0b'] : ['#3b82f6', '#2563eb', '#3b82f6']
            } : {}}
            transition={{ duration: 0.3 }}
            className={`${subjectIndex > 0 && onBack ? 'flex-1' : 'w-full'} py-3 rounded-xl font-bold text-lg transition-all ${
              subjectIndex === totalSubjects - 1
                ? 'bg-accent text-white hover:bg-amber-600'
                : 'bg-primary text-white hover:bg-blue-600'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {subjectIndex === totalSubjects - 1 ? t.finish : t.next}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
