'use client';

import React, { useState } from 'react';

interface Podcast {
  id: string;
  title: string;
  audioUrl: string;
}

const PodcastPlayer: React.FC = () => {
  const [podcasts] = useState<Podcast[]>([
    { id: '1', title: 'Sleep Summit 2024 AI Podcast Day 1', audioUrl: '/path/to/audio1.wav' },
    { id: '2', title: 'Sleep Summit 2024 AI Podcast Day 2', audioUrl: '/path/to/audio2.wav' },
  ]);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);

  const handlePodcastSelect = (podcast: Podcast) => {
    setCurrentPodcast(podcast);
  };

  return (
    <div className="bg-[#2c3e50] text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Sleep Summit 2024 Podcasts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="podcast-list">
          <h3 className="text-xl font-semibold mb-2">Available Episodes</h3>
          <ul className="space-y-2">
            {podcasts.map((podcast) => (
              <li key={podcast.id}>
                <button
                  onClick={() => handlePodcastSelect(podcast)}
                  className="text-left hover:text-yellow-400 transition-colors"
                >
                  {podcast.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="podcast-player">
          {currentPodcast && (
            <div>
              <h3 className="text-xl font-semibold mb-2">{currentPodcast.title}</h3>
              <audio controls className="w-full">
                <source src={currentPodcast.audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 text-right">
        <span className="text-xs text-gray-400">Powered by MattressAI</span>
      </div>
    </div>
  );
};

export default PodcastPlayer;