import Image from "next/image";
import Link from 'next/link';
import dynamic from 'next/dynamic';

const PodcastPlayer = dynamic(() => import('./components/PodcastPlayer'), { ssr: false });

// Define your episodes data
const episodes = [
  {
    id: '1',
    title: 'Episode 1',
    audioUrl: '/path/to/episode1.mp3',
  },
  {
    id: '2',
    title: 'Episode 2',
    audioUrl: '/path/to/episode2.mp3',
  },
  // Add more episodes as needed
];

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-5">
      <div className="text-center mb-10">
        <div className="hero-image mb-10 max-w-md mx-auto">
          <Image
            src="/images/back-to-future-sleep.jpg"
            alt="Back to the Future Sleep"
            width={500}
            height={300}
            style={{ objectFit: 'cover' }} // Use this instead of objectFit prop
            className="rounded-lg w-full h-auto"
          />
        </div>
        <div className="bg-[rgba(44,62,80,0.8)] rounded-lg p-10 mb-10">
          <h1 className="text-4xl font-bold mb-4">
            Capture Your Memories from Sleep Summit 2024
          </h1>
          <p className="mb-8">
            Start your journey through time and sleep innovation
          </p>
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-wrap justify-center gap-5">
              <Link href="/journal">
                <button className="bg-[#e67e22] hover:bg-[#d35400] text-white font-bold py-3 px-6 rounded transition duration-300">
                  Start Journaling
                </button>
              </Link>
              <Link href="/shared-journal">
                <button className="bg-[#3498db] hover:bg-[#2980b9] text-white font-bold py-3 px-6 rounded transition duration-300">
                  View Shared FAM Journal
                </button>
              </Link>
            </div>
            <Link href="/ai-podcast">
              <button className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white font-bold py-3 px-6 rounded transition duration-300">
                AI Generated Sleep Summit Podcast
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-10">
          <p className="mb-2">OCTOBER 8-11, 2024 • BENTONVILLE, ARKANSAS</p>
          <h2 className="text-4xl font-bold my-2">SLEEP SUMMIT 2024</h2>
          <p className="text-xl text-yellow-400">REWIND TO WHAT WORKS AND REIMAGINE THE FUTURE</p>
        </div>
      </div>
      <PodcastPlayer episodes={episodes} />
    </div>
  );
}
