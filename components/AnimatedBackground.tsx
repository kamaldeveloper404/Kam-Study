'use client'

import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  const shapes = [
    { size: 100, x: '10%', y: '20%', duration: 20, delay: 0 },
    { size: 150, x: '80%', y: '10%', duration: 25, delay: 2 },
    { size: 80, x: '70%', y: '70%', duration: 18, delay: 4 },
    { size: 120, x: '20%', y: '80%', duration: 22, delay: 1 },
    { size: 90, x: '50%', y: '50%', duration: 24, delay: 3 },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute border-2 border-primary dark:border-accent rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`square-${i}`}
          className="absolute border-2 border-accent dark:border-primary"
          style={{
            width: 60 + i * 20,
            height: 60 + i * 20,
            left: `${30 + i * 25}%`,
            top: `${40 + i * 15}%`,
          }}
          animate={{
            rotate: [0, 90, 180, 270, 360],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 30 + i * 5,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
