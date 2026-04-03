'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'
import { Languages, LogIn } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function WelcomeScreen({ onNext }: { onNext: (data: any) => void }) {
  const [name, setName] = useState('')
  const [showGoogleLogin, setShowGoogleLogin] = useState(false)
  const { language, setLanguage, playSound } = useApp()
  const t = translations[language].welcome

  const handleGuestContinue = () => {
    if (name.trim()) {
      playSound('success')
      onNext({ 
        name: name.trim(), 
        startDate: new Date().toISOString(),
        accountType: 'guest'
      })
    }
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    playSound('click')
    alert(language === 'ar' 
      ? 'تسجيل الدخول بجوجل قريباً! 🚀' 
      : 'Google login coming soon! 🚀')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 relative">
      <AnimatedBackground />
      
      <button
        onClick={() => {
          setLanguage(language === 'ar' ? 'en' : 'ar')
          playSound('click')
        }}
        className="absolute top-6 left-6 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
      >
        <Languages size={24} className="text-primary" />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center relative z-10"
      >
        <div className="text-6xl mb-6">👋</div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{t.subtitle}</p>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleGuestContinue()}
          placeholder={t.placeholder}
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-primary focus:outline-none text-center text-lg mb-4"
        />
        
        <button
          onClick={handleGuestContinue}
          disabled={!name.trim()}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all mb-4"
        >
          {t.guestButton}
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              {language === 'ar' ? 'أو' : 'or'}
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-2 border-gray-300 dark:border-gray-600 py-3 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
        >
          <LogIn size={20} />
          {t.googleButton}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          {language === 'ar' 
            ? 'التسجيل بجوجل يحفظ بياناتك على السحابة' 
            : 'Google login saves your data to the cloud'}
        </p>
      </motion.div>
    </div>
  )
}
