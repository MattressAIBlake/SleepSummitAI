'use client'

import { useState } from 'react';
import styles from './JournalPage.module.css';
import Image from 'next/image';
import { Camera, Calendar, User, FileText } from 'lucide-react';

export default function JournalPage() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('date', date);
    formData.append('comment', comment);
    if (photo) formData.append('photo', photo);

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(`Entry submitted successfully. ID: ${result.id}`);
        // Clear form
        setName('');
        setDate('');
        setComment('');
        setPhoto(null);
      } else {
        const errorData = await response.json();
        setError(`Failed to submit entry: ${errorData.error}`);
      }
    } catch (err) {
      setError(`Error submitting entry: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a3a] to-[#2c3e50] text-white p-8">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Capture Your Memory</h1>
        
        {error && <p className="bg-red-500/50 text-white p-3 rounded mb-4">{error}</p>}
        {success && <p className="bg-green-500/50 text-white p-3 rounded mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute top-3 left-3 text-gray-400" />
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          
          <div className="relative">
            <FileText className="absolute top-3 left-3 text-gray-400" />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your memory..."
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 pl-10 h-32 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          
          <div className="relative">
            <Camera className="absolute top-3 left-3 text-gray-400" />
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
              accept="image/*"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-white hover:file:bg-yellow-500"
            />
          </div>
          
          <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#1a3a3a] font-bold py-3 px-6 rounded-lg transition duration-300">
            Submit Entry
          </button>
        </form>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-xl mb-2">OCTOBER 8-11, 2024 • BENTONVILLE, ARKANSAS</p>
        <h2 className="text-4xl font-bold mb-2">SLEEP SUMMIT 2024</h2>
        <p className="text-xl text-yellow-400">REWIND TO WHAT WORKS AND REIMAGINE THE FUTURE</p>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full h-1/3 opacity-10 pointer-events-none">
        <Image
          src="/images/back-to-future-sleep.jpg"
          alt="DeLorean"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}