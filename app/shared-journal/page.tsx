'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CalendarDays } from "lucide-react";
import { Toaster } from 'react-hot-toast';

interface JournalEntry {
  _id: string;
  name: string;
  date: string;
  comment: string;
  photo?: string;
}

export default function SharedJournalPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    async function fetchJournalEntries() {
      try {
        const response = await fetch('/api/journal');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched journal entries:', data);
          // Sort entries by date (ascending order)
          const sortedEntries = data.sort((a: JournalEntry, b: JournalEntry) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setJournalEntries(sortedEntries);
        } else {
          console.error('Failed to fetch journal entries');
        }
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    }

    fetchJournalEntries();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a3a3a] text-white relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/images/back-to-future-sleep.jpg"
          alt="DeLorean background"
          width={800}
          height={600}
          priority
          style={{ objectFit: 'contain' }}
          className="opacity-30"
        />
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Sleep Summit 2024</h1>
          <h2 className="text-3xl font-semibold mb-4 text-yellow-400">FAM Journal</h2>
          <p className="text-xl">Capturing Memories Across Time</p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-400 transform -translate-x-1/2"></div>
          {journalEntries.map((entry, index) => (
            <div key={entry._id} className={`flex items-center mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                <div className="bg-white/10 backdrop-blur-lg border-none text-white hover:bg-white/20 transition-all duration-300 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-2">{entry.name}</h3>
                  <div className="text-sm text-gray-300 flex items-center mb-4">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {new Date(entry.date).toLocaleString()}
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    {entry.photo ? (
                      <div className="w-full md:w-1/2">
                        <div className="relative w-full pt-[75%]">
                          <Image
                            src={entry.photo}
                            alt={`Memory from ${entry.name}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg absolute top-0 left-0"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full md:w-1/2 bg-gray-700 rounded-lg flex items-center justify-center" style={{height: '200px'}}>
                        <p className="text-gray-400">No photo available</p>
                      </div>
                    )}
                    <div className={entry.photo ? "w-full md:w-1/2" : "w-full"}>
                      <p className="text-lg">{entry.comment}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full border-4 border-[#1a3a3a] z-10"></div>
              <div className="w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}