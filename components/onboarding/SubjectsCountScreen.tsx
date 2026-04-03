'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function SubjectsCountScreen({ onNext }: { onNext: (data: any) => void }) {
  const [count, setCount] = useState(1)
  const { language, playSound } = useApp()
  const t = translations[language].subjects

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 relative">
      <AnimatedBackground />
      
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center relative z-10"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{t.subtitle}</p>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => {
                setCount(num)
                playSound('click')
              }}
              className={`p-6 rounded-xl border-2 transition-all ${
                count === num ? 'border-primary bg-blue-50 dark:bg-blue-900 text-primary' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl font-bold">{num}</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            playSound('success')
            onNext({ subjectsCount: count })
          }}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all"
        >
          {t.next}
        </button>
      </motion.div>
    </div>
  )
}
