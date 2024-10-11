import dynamic from 'next/dynamic';

const PodcastPlayer = dynamic(() => import('../components/PodcastPlayer'), { ssr: false });

const episodes = [
  {
    id: '1',
    title: 'Sleep Summit Day 1',
    audioUrl: '/audio/SleepSummitDay1.wav'
  },
  {
    id: '2',
    title: 'Sleep Summit Day 2',
    audioUrl: '/audio/SleepSummitDay2.wav'
  }
];

export default function AIPodcastPage() {
  return (
    <div className="min-h-screen p-8 bg-[#1e2a38] text-white">
      <h1 className="text-5xl font-bold mb-4 text-center">Capture Your Memories from Sleep Summit 2024</h1>
      <p className="text-xl mb-8 text-center">Start your journey through time and sleep innovation</p>
      <PodcastPlayer episodes={episodes} />
      <div className="mt-12 text-center">
        <p className="text-lg">OCTOBER 8-11, 2024 • BENTONVILLE, ARKANSAS</p>
        <h2 className="text-4xl font-bold mt-2">SLEEP SUMMIT 2024</h2>
        <p className="text-xl mt-2 text-yellow-400">REWIND TO WHAT WORKS AND REIMAGINE THE FUTURE</p>
      </div>
    </div>
  );
}