'use client'

import { useEffect, useState } from 'react';

interface JournalEntry {
  _id: string;
  // Add other fields as needed
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const response = await fetch('/api/journal');
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        } else {
          const errorData = await response.json();
          setError(`Failed to fetch journal entries: ${errorData.error}`);
        }
      } catch (err) {
        setError(`Error fetching entries: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    fetchEntries();
  }, []);

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Journal Entries</h1>
      {entries.length === 0 ? (
        <p>No entries found or still loading...</p>
      ) : (
        entries.map((entry) => (
          <div key={entry._id}>
            {/* Render your journal entry here */}
            <p>Entry ID: {entry._id}</p>
          </div>
        ))
      )}
    </div>
  );
}