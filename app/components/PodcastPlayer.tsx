'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './PodcastPlayer.module.css';

interface Podcast {
  id: string;
  title: string;
  audioUrl: string;
}

interface PodcastPlayerProps {
  episodes: Podcast[];
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ episodes }) => {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentEpisode = episodes && episodes.length > 0 ? episodes[currentEpisodeIndex] : null;

  useEffect(() => {
    if (currentEpisode) {
      console.log('Current episode:', currentEpisode);
    }
  }, [currentEpisode]);

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

  const changeEpisode = (index: number) => {
    setCurrentEpisodeIndex(index);
    setIsPlaying(false);
  };

  if (!episodes || episodes.length === 0) {
    return <div className={styles.podcastPlayer}>No episodes available</div>;
  }

  return (
    <div className={styles.podcastPlayer}>
      <h2 className={styles.podcastTitle}>{currentEpisode?.title}</h2>
      <audio
        ref={audioRef}
        src={currentEpisode?.audioUrl}
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
        {episodes.map((episode, index) => (
          <button
            key={episode.id}
            onClick={() => changeEpisode(index)}
            className={`${styles.episodeButton} ${index === currentEpisodeIndex ? styles.active : ''}`}
          >
            {episode.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PodcastPlayer;