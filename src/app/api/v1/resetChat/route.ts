import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Define the structure for a chat message
interface ChatMessage {
    type: 'user' | 'bot';
    timestamp: number;
    content: Array<{ type: 'text' | 'image'; value: string }>;
}

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI as string);
const dbName = 'canvaChat';
const collectionName = 'chats';

// Function to create a new chat
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Define the path to the greetings.json file
        const greetingsFilePath = path.join(process.cwd(), 'data', 'greeting.json');

        // Read the greeting messages from the file
        const greetingsData = fs.readFileSync(greetingsFilePath, 'utf-8');
        const greetings = JSON.parse(greetingsData);

        // Select a random greeting message
        const randomGreetingIndex = Math.floor(Math.random() * greetings.length);
        const randomGreeting = greetings[randomGreetingIndex];

        // Initialize a new chat object with the random greeting
        const newChat: ChatMessage[] = [{
            type: 'bot',
            timestamp: Date.now(),
            content: randomGreeting.content, // Use the content of the random greeting
        }];

        // Insert the new chat object into the collection
        const result = await collection.insertOne({ messages: newChat });

        // Return the ID of the newly created chat object
        return new NextResponse(JSON.stringify({ success: true, chatId: result.insertedId }), { status: 201 });
    } catch (error) {
        console.error('Error creating new chat:', error);
        return new NextResponse(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
    } finally {
        await client.close();
    }
}
