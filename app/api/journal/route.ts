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
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
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
      console.error('MongoDB Server Error:', error.code, error.message);
    } else if (error instanceof MongoNetworkError) {
      console.error('MongoDB Network Error:', error.message);
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
    console.log('POST request received');
    const { db } = await connectToDatabase();
    console.log('Connected to database');
    const collection = db.collection('entries');

    const formData = await request.formData();
    const formDataObject: Record<string, string> = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value.toString();
    });
    console.log('Form data:', formDataObject);

    // Validate required fields
    if (!formDataObject.name || !formDataObject.date || !formDataObject.comment) {
      console.error('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const entry = {
      name: formDataObject.name,
      date: new Date(formDataObject.date), // Convert to Date object
      comment: formDataObject.comment,
      createdAt: new Date(), // Add a timestamp
    };

    console.log('Inserting entry:', entry);
    const result = await collection.insertOne(entry);
    console.log('Entry inserted, ID:', result.insertedId);

    return NextResponse.json({ id: result.insertedId, message: 'Entry submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/journal:', error);
    
    if (error instanceof MongoServerError) {
      console.error('MongoDB Server Error:', error.code, error.message);
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
    } else if (error instanceof MongoNetworkError) {
      console.error('MongoDB Network Error:', error.message);
      return NextResponse.json({ error: 'Database connection error', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ 
      error: 'An unexpected error occurred', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// Add POST method here if needed