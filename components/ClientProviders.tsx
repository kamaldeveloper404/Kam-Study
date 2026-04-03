'use client'

import { useEffect } from 'react'
import { AppProvider } from '@/lib/context'
import PWAInstallPrompt from './PWAInstallPrompt'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration)
          })
          .catch((error) => {
            console.log('SW registration failed:', error)
          })
      })
    }
  }, [])

  return (
    <AppProvider>
      {children}
      <PWAInstallPrompt />
    </AppProvider>
  )
}
