import fs from 'fs';
import path from 'path';

// Define the structure for a chat message
interface ChatMessage {
    type: 'user' | 'bot';
    content: Array<{ type: 'text' | 'image'; value: string }>;
}

// Helper function to get a random greeting
const getRandomGreeting = (greetings: ChatMessage[]): ChatMessage => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
};

export async function POST(req: Request): Promise<Response> {
    try {
        // Define the path to the greeting.json file
        const greetingsFilePath = path.join(process.cwd(), 'data', 'greeting.json');

        // Read the greeting messages
        const greetingsData = fs.readFileSync(greetingsFilePath, 'utf-8');
        const greetings: ChatMessage[] = JSON.parse(greetingsData);

        // Get a random greeting message
        const greetingMessage = getRandomGreeting(greetings);

        // Define the path to the chatMessages.json file
        const chatMessagesFilePath = path.join(process.cwd(), 'data', 'chatMessages.json');

        // Reset chat messages by writing the greeting message to chatMessages.json
        fs.writeFileSync(chatMessagesFilePath, JSON.stringify([greetingMessage], null, 2), 'utf-8');

        // Send a success response with the greeting message
        return new Response(JSON.stringify({ success: true, greeting: greetingMessage }), { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
