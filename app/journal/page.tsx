'use client'

import { useEffect, useState } from 'react';

interface JournalEntry {
  _id: string;
  // Add other fields as needed
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    async function fetchEntries() {
      const response = await fetch('/api/journal');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        console.error('Failed to fetch journal entries');
      }
    }

    fetchEntries();
  }, []);

  return (
    <div>
      <h1>Journal Entries</h1>
      {entries.map((entry) => (
        <div key={entry._id}>
          {/* Render your journal entry here */}
        </div>
      ))}
    </div>
  );
}