'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function InfoScreen({ onNext, onBack }: { onNext: (data: any) => void; onBack?: () => void }) {
  const [grade, setGrade] = useState('')
  const [country, setCountry] = useState('')
  const { language, playSound } = useApp()
  const t = translations[language].info

  const grades = language === 'ar' 
    ? ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي']
    : ['Grade 10', 'Grade 11', 'Grade 12']
    
  const countries = language === 'ar'
    ? ['مصر', 'السعودية', 'الإمارات', 'الكويت', 'الأردن', 'فلسطين']
    : ['Egypt', 'Saudi Arabia', 'UAE', 'Kuwait', 'Jordan', 'Palestine']

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 relative">
      <AnimatedBackground />
      
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative z-10"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">{t.subtitle}</p>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-3">{t.grade}</label>
          <div className="space-y-2">
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGrade(g)
                  playSound('click')
                }}
                className={`w-full p-3 rounded-xl border-2 transition-all ${
                  grade === g ? 'border-primary bg-blue-50 dark:bg-blue-900 text-primary' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-3">{t.country}</label>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              playSound('click')
            }}
            className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-xl focus:border-primary focus:outline-none"
          >
            <option value="">{t.selectCountry}</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            if (grade && country) {
              playSound('success')
              onNext({ grade, country })
            }
          }}
          disabled={!grade || !country}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {t.next}
        </button>
      </motion.div>
    </div>
  )
}
