'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'
import { FiSettings, FiUser, FiLock, FiBell, FiMail, FiSave } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    emailNotifications: true
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, notifications, email_notifications')
            .eq('id', user.id)
            .single()

          setUser(user)
          setFormData({
            full_name: profile?.full_name || '',
            email: user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            notifications: profile?.notifications ?? true,
            emailNotifications: profile?.email_notifications ?? true
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          notifications: formData.notifications,
          email_notifications: formData.emailNotifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (profileError) throw profileError

      if (formData.currentPassword && formData.newPassword && formData.confirmPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords don't match")
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword,
          data: { password_updated_at: new Date().toISOString() }
        })

        if (passwordError) throw passwordError
      }

      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiSettings size={24} />
          Settings
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiUser />
            Profile Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiLock />
            Change Password
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiBell />
            Notification Preferences
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                Enable in-app notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Enable email notifications
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            <FiSave />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}