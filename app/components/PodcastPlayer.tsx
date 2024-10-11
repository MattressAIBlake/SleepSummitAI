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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log('Episode data:', episode);
    console.log('Audio URL:', episode.audioUrl);
  }, [episode]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    // Add your time update logic here if needed
  };

  const handleLoadedMetadata = () => {
    // Add your loaded metadata logic here if needed
  };

  return (
    <div className={styles.podcastPlayer}>
      <h2 className={styles.podcastTitle}>{episode.title}</h2>
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={(e) => console.error('Audio error:', e)}
      />
      <div className={styles.audioControls}>
        <button className={styles.playPauseButton} onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        {/* Add more controls here if needed */}
      </div>
    </div>
  );
};

export default PodcastPlayer;