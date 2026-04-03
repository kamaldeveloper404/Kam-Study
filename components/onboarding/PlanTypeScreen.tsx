'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Target } from 'lucide-react'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function PlanTypeScreen({ onNext }: { onNext: (data: any) => void }) {
  const [planType, setPlanType] = useState<'term' | 'revision' | null>(null)
  const { language, playSound } = useApp()
  const t = translations[language].planType

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
        
        <div className="space-y-4 mb-6">
          <button
            onClick={() => {
              setPlanType('term')
              playSound('click')
            }}
            className={`w-full p-6 rounded-xl border-2 transition-all text-right ${
              planType === 'term' 
                ? 'border-primary bg-blue-50 dark:bg-blue-900' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${planType === 'term' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <BookOpen size={28} className={planType === 'term' ? 'text-white' : 'text-gray-600 dark:text-gray-300'} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t.term}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.termDesc}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setPlanType('revision')
              playSound('click')
            }}
            className={`w-full p-6 rounded-xl border-2 transition-all text-right ${
              planType === 'revision' 
                ? 'border-accent bg-amber-50 dark:bg-amber-900' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${planType === 'revision' ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <Target size={28} className={planType === 'revision' ? 'text-white' : 'text-gray-600 dark:text-gray-300'} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t.revision}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.revisionDesc}</p>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={() => {
            if (planType) {
              playSound('success')
              onNext({ planType })
            }
          }}
          disabled={!planType}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {t.next}
        </button>
      </motion.div>
    </div>
  )
}
