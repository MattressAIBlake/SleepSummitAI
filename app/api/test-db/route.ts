import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    return NextResponse.json({ message: 'Connected to MongoDB successfully' });
  } catch (error: unknown) {
    console.error('MongoDB connection error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to connect to MongoDB', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
    }
  }
}