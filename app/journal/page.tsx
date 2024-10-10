'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'react-hot-toast'

export default function JournalPage() {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    if (!name.trim()) return 'Name is required'
    if (!date) return 'Date is required'
    if (!comment.trim()) return 'Comment is required'
    if (photo && photo.size > 5 * 1024 * 1024) return 'Photo size should be less than 5MB'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const error = validateForm()
    if (error) {
      toast.error(error)
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('date', date)
      formData.append('comment', comment)
      if (photo) {
        formData.append('photo', photo)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journal`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      console.log('Server response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit journal entry')
      }

      if (result.success) {
        toast.success(`Journal entry submitted successfully! ID: ${result.id}`)
        router.push('/shared-journal')
      } else {
        throw new Error('Failed to submit journal entry')
      }
    } catch (error) {
      console.error('Error submitting journal entry:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
      }
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-5">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-[rgba(44,62,80,0.8)] rounded-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Journal Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="w-full p-2 rounded bg-[#34495e] text-white placeholder-gray-400"
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 rounded bg-[#34495e] text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="w-full p-2 rounded bg-[#34495e] text-white"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your comment..."
            required
            className="w-full p-2 rounded bg-[#34495e] text-white placeholder-gray-400 h-32"
          />
          <button 
            type="submit"
            className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white font-bold py-3 px-6 rounded transition duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}