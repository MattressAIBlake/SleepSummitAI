import { NextResponse } from 'next/server';

const podcasts = [
  {
    id: '1',
    title: 'Sleep Summit 2024 AI Podcast Day 1',
    audioUrl: '/audio/SleepSummitDay1.wav',
  },
  // Add more podcast entries as needed
];

export async function GET() {
  return NextResponse.json(podcasts);
}