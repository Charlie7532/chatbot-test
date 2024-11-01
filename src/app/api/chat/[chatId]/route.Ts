// app/api/chat/[chatId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI as string);
const dbName = 'canvaChat'; 
const collectionName = 'chats'; 

// Function to connect to the database
async function connectToDatabase() {
    await client.connect();
    return client.db(dbName).collection(collectionName);
}

// GET method for retrieving a chat by ID
export async function GET(req: NextRequest, { params }: { params: { chatId: string } }): Promise<NextResponse> {
    console.log("this is working :");
    try {
        const { chatId } = params;
        const chatCollection = await connectToDatabase();
        
        // Fetch the chat by ID
        const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });

        if (!chat) {
            return new NextResponse(JSON.stringify({ success: false, error: 'Chat not found' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify(chat), { status: 200 });
    } catch (error) {
        console.error('Error retrieving chat:', error);
        return new NextResponse(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
    } finally {
        await client.close();
    }
}
