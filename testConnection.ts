require('dotenv').config({ path: '.env.local' });
import { MongoClient, MongoServerError, MongoNetworkError } from 'mongodb';

async function testConnection() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in the environment variables');
    process.exit(1);
  }

  console.log('MONGODB_URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Log the URI with password hidden

  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected successfully to MongoDB');
    await client.db('journalDB').command({ ping: 1 });
    console.log('MongoDB is responsive');
  } catch (error: unknown) {
    console.error('Failed to connect to MongoDB:', error);
    if (error instanceof MongoServerError) {
      console.error('Error code:', error.code);
      console.error('Error message:', error.errmsg || error.message);
    } else if (error instanceof MongoNetworkError) {
      console.error('Network error details:', error.message);
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  } finally {
    await client.close();
  }
}

testConnection();