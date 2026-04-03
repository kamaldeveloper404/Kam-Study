'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import WelcomeScreen from '@/components/onboarding/WelcomeScreen'
import InfoScreen from '@/components/onboarding/InfoScreen'
import PlanTypeScreen from '@/components/onboarding/PlanTypeScreen'
import SubjectsCountScreen from '@/components/onboarding/SubjectsCountScreen'
import SubjectDetailsScreen from '@/components/onboarding/SubjectDetailsScreen'
import Dashboard from '@/components/dashboard/Dashboard'

export default function Home() {
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState<any>(null)
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('studyFlowData')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Check if data structure is valid
        if (parsed.subjects && Array.isArray(parsed.subjects) && parsed.subjects.length > 0) {
          setUserData(parsed)
          setStep(100)
        } else {
          // Invalid data, clear it
          localStorage.removeItem('studyFlowData')
        }
      } catch (error) {
        // Invalid JSON, clear it
        localStorage.removeItem('studyFlowData')
      }
    }
  }, [])

  const saveData = (data: any) => {
    const updated = { ...userData, ...data }
    setUserData(updated)
    localStorage.setItem('studyFlowData', JSON.stringify(updated))
  }

  const handleSubjectComplete = (subjectData: any) => {
    const subjects = userData.subjects || []
    subjects[currentSubjectIndex] = subjectData
    
    if (currentSubjectIndex < userData.subjectsCount - 1) {
      saveData({ subjects })
      setCurrentSubjectIndex(currentSubjectIndex + 1)
    } else {
      // All subjects collected, now create unified schedule
      const unifiedSchedule = createUnifiedSchedule(subjects, userData.planType)
      saveData({ subjects, unifiedSchedule })
      setStep(100)
    }
  }

  const handleSubjectBack = () => {
    if (currentSubjectIndex > 0) {
      setCurrentSubjectIndex(currentSubjectIndex - 1)
    } else {
      setStep(3) // Go back to subjects count
    }
  }

  const createUnifiedSchedule = (subjects: any[], planType: 'term' | 'revision') => {
    // Find the earliest exam date
    let minExamDate = new Date(subjects[0].examDate)
    
    subjects.forEach(subject => {
      const examDate = new Date(subject.examDate)
      if (examDate < minExamDate) minExamDate = examDate
    })
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    minExamDate.setHours(0, 0, 0, 0)
    
    // Use ALL available days (no deduction for revision)
    const totalDays = Math.max(1, Math.floor((minExamDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
    
    // Create schedule using the new algorithm
    return createDayDrivenSchedule(subjects, totalDays, planType)
  }

  const createDayDrivenSchedule = (subjects: any[], totalDays: number, planType: 'term' | 'revision') => {
    const schedule: any[] = []
    
    // Prepare lesson queues for each subject (Round Robin)
    const subjectQueues: any[][] = subjects.map(subject => 
      subject.lessons.map((lesson: string) => ({
        name: lesson,
        subjectName: subject.name,
        type: 'study',
        completed: false,
        needsPractice: planType === 'term' && subject.practiceGap > 0,
        practiceCount: planType === 'term' ? (subject.practiceGap || 0) : 0
      }))
    )
    
    // Track lessons from previous days that need practice
    const previousDayLessons: any[] = []
    
    let currentSubjectIndex = 0
    let totalLessonsRemaining = subjectQueues.reduce((sum, queue) => sum + queue.length, 0)
    
    // Loop through each day
    for (let day = 1; day <= totalDays; day++) {
      const dayLessons: any[] = []
      const daysRemaining = totalDays - day + 1
      
      // Calculate how many NEW lessons we need today
      const lessonsPerDay = Math.ceil(totalLessonsRemaining / daysRemaining)
      
      // Add NEW lessons (Round Robin between subjects)
      let addedNewLessons = 0
      let attempts = 0
      const maxAttempts = subjects.length * 3
      const todayNewLessons: any[] = []
      
      while (addedNewLessons < lessonsPerDay && totalLessonsRemaining > 0 && attempts < maxAttempts) {
        const subjectIndex = currentSubjectIndex % subjects.length
        
        if (subjectQueues[subjectIndex].length > 0) {
          const lesson = subjectQueues[subjectIndex].shift()!
          dayLessons.push(lesson)
          todayNewLessons.push(lesson)
          
          addedNewLessons++
          totalLessonsRemaining--
        }
        
        currentSubjectIndex++
        attempts++
      }
      
      // Add PRACTICE tasks from PREVIOUS day's lessons (not today's!)
      if (day > 1 && previousDayLessons.length > 0) {
        const maxPracticePerDay = planType === 'term' ? 2 : 0
        const practiceToAdd = Math.min(maxPracticePerDay, previousDayLessons.length)
        
        for (let i = 0; i < practiceToAdd; i++) {
          const prevLesson = previousDayLessons.shift()!
          dayLessons.push({
            name: `حل على: ${prevLesson.name}`,
            subjectName: prevLesson.subjectName,
            type: 'practice',
            completed: false
          })
        }
      }
      
      // Add today's new lessons to the queue for future practice
      if (planType === 'term') {
        todayNewLessons.forEach(lesson => {
          if (lesson.needsPractice && lesson.practiceCount > 0) {
            for (let i = 0; i < lesson.practiceCount; i++) {
              previousDayLessons.push(lesson)
            }
          }
        })
      }
      
      // Add day to schedule if it has lessons
      if (dayLessons.length > 0) {
        schedule.push({
          day: day,
          lessons: dayLessons
        })
      }
    }
    
    // If there are remaining practice tasks, distribute them in the last days
    if (previousDayLessons.length > 0 && schedule.length > 0) {
      let dayIndex = schedule.length - 1
      while (previousDayLessons.length > 0 && dayIndex >= 0) {
        const prevLesson = previousDayLessons.shift()!
        schedule[dayIndex].lessons.push({
          name: `حل على: ${prevLesson.name}`,
          subjectName: prevLesson.subjectName,
          type: 'practice',
          completed: false
        })
        dayIndex--
        if (dayIndex < 0) dayIndex = schedule.length - 1
      }
    }
    
    return schedule
  }

  if (step === 100 && userData) {
    return <Dashboard userData={userData} />
  }

  if (step === 0) {
    return <WelcomeScreen onNext={(data) => { saveData(data); setStep(1) }} />
  }
  
  if (step === 1) {
    return <InfoScreen onNext={(data) => { saveData(data); setStep(2) }} />
  }
  
  if (step === 2) {
    return <PlanTypeScreen onNext={(data) => { saveData(data); setStep(3) }} />
  }
  
  if (step === 3) {
    return <SubjectsCountScreen onNext={(data) => { 
      saveData({ ...data, subjects: [] })
      setStep(4)
    }} />
  }
  
  if (step === 4 && userData) {
    return (
      <SubjectDetailsScreen
        subjectIndex={currentSubjectIndex}
        totalSubjects={userData.subjectsCount}
        planType={userData.planType}
        onNext={handleSubjectComplete}
        onBack={handleSubjectBack}
      />
    )
  }

  return <div className="min-h-screen bg-white dark:bg-gray-900" />
}
