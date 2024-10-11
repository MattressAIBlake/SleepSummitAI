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
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentEpisode = episodes && episodes.length > 0 ? episodes[currentEpisodeIndex] : null;

  useEffect(() => {
    if (currentEpisode) {
      setIsLoaded(false);
      setIsPlaying(false);
    }
  }, [currentEpisode]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else if (isLoaded) {
        audioRef.current.play().catch(e => console.error('Play failed:', e));
      }
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleLoadedMetadata = () => setIsLoaded(true);

  const changeEpisode = (index: number) => {
    setCurrentEpisodeIndex(index);
    setIsPlaying(false);
    setIsLoaded(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const target = e.target as HTMLAudioElement;
    console.error('Audio error:', {
      error: target.error,
      src: target.src,
      readyState: target.readyState,
      networkState: target.networkState,
    });
  };

  if (!episodes || episodes.length === 0) {
    return <div className={styles.podcastPlayer}>No episodes available</div>;
  }

  return (
    <div className={styles.podcastPlayer}>
      <h2 className={styles.podcastTitle}>{currentEpisode?.title}</h2>
      {currentEpisode && (
        <audio
          ref={audioRef}
          src={currentEpisode.audioUrl}
          onPlay={handlePlay}
          onPause={handlePause}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
        />
      )}
      <div className={styles.audioControls}>
        <button 
          className={styles.playPauseButton} 
          onClick={togglePlayPause}
          disabled={!isLoaded}
        >
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