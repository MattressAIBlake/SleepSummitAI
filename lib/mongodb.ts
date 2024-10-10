import { MongoClient, MongoServerError, MongoNetworkError } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsInsecure: false,
  serverSelectionTimeoutMS: 5000, // 5 seconds
  connectTimeoutMS: 10000, // 10 seconds
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Define a type for the global object with our custom property
declare global {
  let _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB. Pinging database...');
    await client.db('journalDB').command({ ping: 1 }); // Ensure lowercase 'journalDB'
    console.log("MongoDB connection test successful");
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.error('MongoDB Server Error:', error.code, error.message);
    } else if (error instanceof MongoNetworkError) {
      console.error('MongoDB Network Error:', error.message);
    } else {
      console.error('Unknown MongoDB Error:', error);
    }
    throw error;
  }
}

// Remove the connectToDatabase function as it's using undefined variables