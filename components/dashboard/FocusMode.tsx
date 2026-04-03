'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Play, Pause, BellOff } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useApp } from '@/lib/context'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function FocusMode({ lesson, onComplete, onClose }: any) {
  const [duration, setDuration] = useState(30)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showDndAlert, setShowDndAlert] = useState(true)
  const { language, playSound } = useApp()

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            handleComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isRunning, timeLeft])

  const handleComplete = () => {
    playSound('complete')
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']
    })
    setTimeout(() => {
      onComplete()
    }, 2000)
  }

  const startTimer = () => {
    setTimeLeft(duration * 60)
    setIsRunning(true)
    setShowDndAlert(false)
    playSound('success')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-6 relative">
      <AnimatedBackground />
      
      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {language === 'ar' ? 'وضع التركيز 🎯' : 'Focus Mode 🎯'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{lesson.name}</h3>
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-600 dark:text-gray-300">{lesson.subjectName}</p>
              {lesson.type === 'practice' && (
                <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                  {language === 'ar' ? '📝 حل وتمارين' : '📝 Practice'}
                </span>
              )}
              {lesson.type === 'study' && (
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                  {language === 'ar' ? '📚 دراسة' : '📚 Study'}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {language === 'ar' ? 'ركز وانجز!' : 'Focus and achieve!'}
            </p>
          </div>

          {showDndAlert && !isRunning && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-amber-50 dark:bg-amber-900 border-2 border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <BellOff className="text-amber-600 mt-1" size={20} />
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-200 mb-1">
                  {language === 'ar' ? 'تنبيه مهم!' : 'Important!'}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {language === 'ar' 
                    ? 'فعّل وضع "عدم الإزعاج" على جهازك عشان تركز أحسن' 
                    : 'Enable "Do Not Disturb" mode on your device for better focus'}
                </p>
              </div>
            </motion.div>
          )}

          {!isRunning && timeLeft === 0 ? (
            <>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-3 text-center">
                  {language === 'ar' ? 'اختر مدة الجلسة' : 'Choose session duration'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => {
                        setDuration(mins)
                        playSound('click')
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        duration === mins ? 'border-primary bg-blue-50 dark:bg-blue-900 text-primary' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl font-bold">{mins}</div>
                      <div className="text-xs">{language === 'ar' ? 'دقيقة' : 'min'}</div>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[90, 120].map(mins => (
                    <button
                      key={mins}
                      onClick={() => {
                        setDuration(mins)
                        playSound('click')
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        duration === mins ? 'border-primary bg-blue-50 dark:bg-blue-900 text-primary' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl font-bold">{mins}</div>
                      <div className="text-xs">{language === 'ar' ? 'دقيقة' : 'min'}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startTimer}
                className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
              >
                <Play size={24} />
                {language === 'ar' ? 'ابدأ الآن!' : 'Start Now!'}
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-primary dark:text-accent mb-4">{formatTime(timeLeft)}</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-accent h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${((duration * 60 - timeLeft) / (duration * 60)) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setIsRunning(!isRunning)
                  playSound('click')
                }}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
                {isRunning 
                  ? (language === 'ar' ? 'إيقاف مؤقت' : 'Pause') 
                  : (language === 'ar' ? 'استئناف' : 'Resume')}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
