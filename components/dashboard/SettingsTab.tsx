'use client'

import { motion } from 'framer-motion'
import { Languages, Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'

export default function SettingsTab() {
  const { language, setLanguage, theme, setTheme, soundsEnabled, setSoundsEnabled, playSound } = useApp()
  const t = translations[language].settings

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.title}</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Languages size={24} className="text-primary" />
            <span className="font-bold text-gray-800 dark:text-white">{t.language}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setLanguage('ar')
              playSound('click')
            }}
            className={`p-3 rounded-xl border-2 transition-all ${
              language === 'ar' 
                ? 'border-primary bg-blue-50 dark:bg-blue-900 text-primary' 
                : 'border-gray-200 dark:border-gray-600'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => {
              setLanguage('en')
              playSound('click')
            }}
            className={`p-3 rounded-xl border-2 transition-all ${
              language === 'en' 
                ? 'border-primary bg-blue-50 dark:bg-blue-900 text-primary' 
                : 'border-gray-200 dark:border-gray-600'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Sun size={24} className="text-accent" /> : <Moon size={24} className="text-primary" />}
            <span className="font-bold text-gray-800 dark:text-white">{t.theme}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setTheme('light')
              playSound('click')
            }}
            className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
              theme === 'light' 
                ? 'border-primary bg-blue-50 dark:bg-blue-900 text-primary' 
                : 'border-gray-200 dark:border-gray-600'
            }`}
          >
            <Sun size={20} />
            {t.light}
          </button>
          <button
            onClick={() => {
              setTheme('dark')
              playSound('click')
            }}
            className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
              theme === 'dark' 
                ? 'border-primary bg-blue-50 dark:bg-blue-900 text-primary' 
                : 'border-gray-200 dark:border-gray-600'
            }`}
          >
            <Moon size={20} />
            {t.dark}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {soundsEnabled ? <Volume2 size={24} className="text-primary" /> : <VolumeX size={24} className="text-gray-400" />}
            <span className="font-bold text-gray-800 dark:text-white">{t.sounds}</span>
          </div>
          <button
            onClick={() => {
              setSoundsEnabled(!soundsEnabled)
              if (!soundsEnabled) playSound('click')
            }}
            className={`relative w-14 h-8 rounded-full transition-all ${
              soundsEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
              soundsEnabled ? 'right-1' : 'left-1'
            }`} />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {soundsEnabled ? t.enabled : t.disabled}
        </p>
      </div>
    </motion.div>
  )
}
