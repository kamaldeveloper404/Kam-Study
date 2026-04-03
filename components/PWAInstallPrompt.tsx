'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { useApp } from '@/lib/context'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const { language } = useApp()

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Check if user dismissed before
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      return
    }

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show prompt after 3 seconds
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA installed')
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border-2 border-primary">
            <button
              onClick={handleDismiss}
              className="absolute top-2 left-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Download size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                  {language === 'ar' ? 'نزّل التطبيق!' : 'Install App!'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {language === 'ar' 
                    ? 'نزّل Study Flow على جهازك عشان تستخدمه بدون نت وبسرعة أكبر!' 
                    : 'Install Study Flow on your device for offline access and faster performance!'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleInstall}
              className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-all"
            >
              {language === 'ar' ? 'تنزيل الآن 📲' : 'Install Now 📲'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
