'use client'

import { useState } from 'react';
import styles from './JournalPage.module.css';

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
    <div className={styles.container}>
      <h1 className={styles.title}>Submit Journal Entry</h1>
      
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      
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
        <button type="submit" className={styles.button}>Submit Entry</button>
      </form>
    </div>
  );
}