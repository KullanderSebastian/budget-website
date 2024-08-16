import { MongoClient } from 'mongodb';

let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    global._mongoClientPromise = client.connect();
    console.log('MongoDB connected'); // Add this line
}

clientPromise = global._mongoClientPromise;

export default clientPromise;