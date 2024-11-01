import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);
const dbName = 'canvaChat'; // Your actual database name
const collectionName = 'chats'; // Your collection name

// Connect to the database
async function connectToDatabase() {
    await client.connect();
    return client.db(dbName).collection(collectionName);
}

// GET method for retrieving a specific chat by ID from query parameters
export async function GET(req: Request): Promise<NextResponse> {
    // Extract the ID from the query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Get the 'id' parameter

    if (!id) {
        return new NextResponse(JSON.stringify({ success: false, message: 'ID parameter is required' }), { status: 400 });
    }

    try {
        const chatCollection = await connectToDatabase();
        const chat = await chatCollection.findOne({ _id: new ObjectId(id) }); // Use ObjectId to find the chat

        if (!chat) {
            return new NextResponse(JSON.stringify({ success: false, message: 'Chat not found' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify(chat), { status: 200 });
    } catch (error) {
        console.error('Error processing GET request:', error);
        return new NextResponse(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
    } finally {
        await client.close(); // Close the database connection
    }
}
