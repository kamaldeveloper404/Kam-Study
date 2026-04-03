'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type AppContextType = {
  language: 'ar' | 'en'
  setLanguage: (lang: 'ar' | 'en') => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  soundsEnabled: boolean
  setSoundsEnabled: (enabled: boolean) => void
  playSound: (type: 'click' | 'success' | 'complete') => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [soundsEnabled, setSoundsEnabled] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('appSettings')
    if (saved) {
      const settings = JSON.parse(saved)
      setLanguage(settings.language || 'ar')
      setTheme(settings.theme || 'light')
      setSoundsEnabled(settings.soundsEnabled ?? true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify({ language, theme, soundsEnabled }))
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', language)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [language, theme, soundsEnabled])

  const playSound = (type: 'click' | 'success' | 'complete') => {
    if (!soundsEnabled || typeof window === 'undefined') return
    
    try {
      const frequencies: Record<string, number> = {
        click: 800,
        success: 1000,
        complete: 1200
      }
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequencies[type]
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log('Sound not supported')
    }
  }

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, soundsEnabled, setSoundsEnabled, playSound }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
