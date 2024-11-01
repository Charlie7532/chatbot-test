import { MongoClient, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { getChatGptResponse } from './getAssistantAnswer';

// Define the structure for a chat message
interface ChatMessage {
    type: 'user' | 'bot';
    timestamp: number;
    content: Array<{ type: 'text' | 'image'; value: string }>;
}

// Define the structure for the chat document
interface ChatDocument {
    _id?: ObjectId;
    messages: ChatMessage[];
}

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI as string);
const dbName = 'canvaChat';
const collectionName = 'chats';

// POST method for adding a new message by chat ID
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Get the message and chat ID from the request
        const { message, chatId }: { message: string; chatId: string } = await req.json();

        const botResponse = await getChatGptResponse(message);

        // Connect to MongoDB
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection<ChatDocument>(collectionName); // Specify ChatDocument type

        // Create the new message object
        const newMessage: ChatMessage = {
            type: 'bot',
            timestamp: Date.now(),
            content: botResponse,
        };

        console.log("message: ", newMessage);

        // Update the chat document by adding the new message to the messages array
        const result = await collection.updateOne(
            { _id: new ObjectId(chatId) },
            { $push: { messages: newMessage as any } }, // Use `as any` for compatibility
            { upsert: true }
        );

        // Check if the update was successful
        if (result.matchedCount === 0) {
            return new NextResponse(JSON.stringify({ success: false, error: 'Chat not found or message not added.' }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error processing POST request:', error);
        return new NextResponse(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
            status: 500,
        });
    } finally {
        await client.close();
    }
}
