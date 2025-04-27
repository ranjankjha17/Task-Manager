'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { FiUser, FiUpload, FiX } from 'react-icons/fi'

export default function AvatarUploader({ url, onUpload }: { url: string | null, onUpload: (url: string) => void }) {
  const supabase = createClientComponentClient()
  const [uploading, setUploading] = useState(false)

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {url ? (
        <img
          src={`${supabase.storage.from('avatars').getPublicUrl(url).data.publicUrl}?${new Date().getTime()}`}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <FiUser size={24} className="text-gray-400" />
        </div>
      )}
      
      <label className="cursor-pointer">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
          <FiUpload size={16} />
          <span className="text-sm">{uploading ? 'Uploading...' : 'Upload'}</span>
        </div>
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  )
}