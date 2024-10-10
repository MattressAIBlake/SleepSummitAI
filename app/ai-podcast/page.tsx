import dynamic from 'next/dynamic';

const PodcastPlayer = dynamic(() => import('../components/PodcastPlayer'), { ssr: false });

export default function AIPodcastPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">AI Generated Sleep Summit Podcast</h1>
      <PodcastPlayer />
    </div>
  );
}