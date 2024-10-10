import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Test route working' });
}

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({ message: 'Received data', data });
}