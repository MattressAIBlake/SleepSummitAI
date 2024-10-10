import { NextResponse } from 'next/server'
import { MongoClient, Db, MongoServerError, MongoNetworkError } from 'mongodb'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    console.log('Using cached database connection');
    return { client: cachedClient, db: cachedDb }
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      ssl: true,
    });
    
    console.log('Connecting to MongoDB...');
    await client.connect()
    console.log('Connected to MongoDB');
    
    console.log('Getting database instance...');
    const db = client.db('journalDB')
    console.log('Database instance obtained');

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    if (error instanceof MongoServerError) {
      console.error('MongoDB Server Error:', error.code, error.message, error);
    } else if (error instanceof MongoNetworkError) {
      console.error('MongoDB Network Error:', error.message, error);
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message, error);
    }
    throw error; // Re-throw the error after logging
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log('Attempting to connect to database...')
    const { db } = await connectToDatabase()
    console.log('Connected to database successfully')

    const collection = db.collection('entries')

    console.log('Fetching entries...')
    const entries = await collection
      .find({})
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()
    console.log(`Fetched ${entries.length} entries`)

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error in GET /api/journal:', error)
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received POST request to /api/journal')
    
    let formData;
    try {
      formData = await request.formData()
      console.log('FormData parsed successfully')
    } catch (formDataError) {
      console.error('Error parsing FormData:', formDataError)
      return NextResponse.json({ error: 'Failed to parse form data', details: formDataError instanceof Error ? formDataError.message : 'Unknown error' }, { status: 400 })
    }
    
    const entry = {
      name: formData.get('name'),
      date: new Date(formData.get('date') as string),
      comment: formData.get('comment'),
      photo: null as string | null,
    }

    // Handle photo upload
    const photoFile = formData.get('photo') as File | null
    if (photoFile) {
      const photoBuffer = await photoFile.arrayBuffer()
      const photoBase64 = Buffer.from(photoBuffer).toString('base64')
      entry.photo = `data:${photoFile.type};base64,${photoBase64}`
    }

    console.log('Journal entry to be stored:', { ...entry, photo: entry.photo ? 'Photo data present' : 'No photo' })

    console.log('Connecting to database...')
    let db;
    try {
      const connection = await connectToDatabase()
      db = connection.db
      console.log('Connected to database successfully')
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json({ error: 'Database connection failed', details: dbError instanceof Error ? dbError.message : 'Unknown error' }, { status: 500 })
    }

    const collection = db.collection('entries')

    console.log('Inserting entry into MongoDB...')
    let result;
    try {
      result = await collection.insertOne(entry)
      console.log('Entry inserted successfully, ID:', result.insertedId)
    } catch (insertError) {
      console.error('Error inserting entry:', insertError)
      return NextResponse.json({ error: 'Failed to insert entry into database', details: insertError instanceof Error ? insertError.message : 'Unknown error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error('Error in POST /api/journal:', error)
    let errorDetails = 'Unknown error'
    let errorStack = ''
    if (error instanceof Error) {
      errorDetails = error.message
      errorStack = error.stack || ''
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ 
      error: 'An unexpected error occurred', 
      details: errorDetails,
      stack: errorStack
    }, { status: 500 })
  }
}

// Add POST method here if needed