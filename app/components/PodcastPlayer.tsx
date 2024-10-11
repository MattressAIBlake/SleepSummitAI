'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './PodcastPlayer.module.css';

interface Podcast {
  id: string;
  title: string;
  audioUrl: string;
}

interface PodcastPlayerProps {
  episode: Podcast;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ episode }) => {
  const [podcasts] = useState<Podcast[]>([
    { id: '1', title: 'Sleep Summit 2024 AI Podcast Day 1', audioUrl: '/path/to/audio1.wav' },
    { id: '2', title: 'Sleep Summit 2024 AI Podcast Day 2', audioUrl: '/path/to/audio2.wav' },
  ]);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log('Episode data:', episode);
    console.log('Audio URL:', episode.audioUrl);
  }, [episode]);

  const handlePlay = () => {
    // Add your play logic here
  };

  const handlePause = () => {
    // Add your pause logic here
  };

  const handleTimeUpdate = () => {
    // Add your time update logic here
  };

  const handleLoadedMetadata = () => {
    // Add your loaded metadata logic here
  };

  const handlePodcastSelect = (podcast: Podcast) => {
    setCurrentPodcast(podcast);
  };

  return (
    <div className={styles.podcastPlayer}>
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={(e) => console.error('Audio error:', e)}
      />
      // ... rest of the component
    </div>
  );
};

export default PodcastPlayer;