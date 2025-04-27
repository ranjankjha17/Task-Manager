'use client'

import { useState, useEffect } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

export default function ThemeSelector() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
    >
      {theme === 'light' ? <FiSun size={18} /> : <FiMoon size={18} />}
      <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
    </button>
  )
}