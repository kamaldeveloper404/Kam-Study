'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Languages, Moon, Sun, Volume2, VolumeX, LogOut } from 'lucide-react'
import { useApp } from '@/lib/context'
import { translations } from '@/lib/translations'

export default function SettingsTab() {
  const { language, setLanguage, theme, setTheme, soundsEnabled, setSoundsEnabled, playSound } = useApp()
  const t = translations[language].settings
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    playSound('success')
    localStorage.clear()
    window.location.reload()
  }

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

      <div className="bg-red-50 dark:bg-red-900 border-2 border-red-200 dark:border-red-700 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-3">
          <LogOut size={24} className="text-red-600 dark:text-red-400" />
          <span className="font-bold text-red-800 dark:text-red-200">{t.logout}</span>
        </div>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          {t.logoutDesc}
        </p>
        <button
          onClick={() => {
            setShowLogoutConfirm(true)
            playSound('click')
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all"
        >
          {t.logoutButton}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {language === 'ar' ? '⚠️ تأكيد تسجيل الخروج' : '⚠️ Confirm Logout'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {language === 'ar' 
                ? 'هيتم حذف كل بياناتك وخطة الدراسة. هتحتاج تبدأ من الأول. متأكد؟'
                : 'All your data and study plan will be deleted. You will need to start over. Are you sure?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false)
                  playSound('click')
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                {language === 'ar' ? 'نعم، احذف كل شيء' : 'Yes, Delete Everything'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
