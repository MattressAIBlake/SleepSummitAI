'use client'

import { useEffect, useState } from 'react';
import styles from './JournalPage.module.css';

interface JournalEntry {
  _id: string;
  name: string;
  date: string;
  comment: string;
  photo?: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
        // Clear form and refresh entries
        setName('');
        setDate('');
        setComment('');
        setPhoto(null);
        fetchEntries();
      } else {
        const errorData = await response.json();
        setError(`Failed to submit entry: ${errorData.error}`);
      }
    } catch (err) {
      setError(`Error submitting entry: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Journal Entries</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          className={styles.input}
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className={styles.input}
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your memory..."
          required
          className={styles.textarea}
        />
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
          accept="image/*"
          className={styles.fileInput}
        />
        <button type="submit" className={styles.button}>Add Entry</button>
      </form>

      <div className={styles.entriesContainer}>
        {entries.length === 0 ? (
          <p>No entries found or still loading...</p>
        ) : (
          entries.map((entry) => (
            <div key={entry._id} className={styles.entry}>
              <h2>{entry.name}</h2>
              <p>{new Date(entry.date).toLocaleString()}</p>
              <p>{entry.comment}</p>
              {entry.photo && <img src={entry.photo} alt="Memory" className={styles.entryImage} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}