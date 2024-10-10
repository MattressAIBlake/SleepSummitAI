import { NextResponse } from 'next/server';

const podcasts = [
  {
    id: '1',
    title: 'The Future of Sleep Technology',
    audioUrl: '/audio/future-of-sleep-tech.mp3',
  },
  {
    id: '2',
    title: 'Understanding Sleep Cycles',
    audioUrl: '/audio/understanding-sleep-cycles.mp3',
  },
  // Add more podcast entries as needed
];

export async function GET() {
  return NextResponse.json(podcasts);
}