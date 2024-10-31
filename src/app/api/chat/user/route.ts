import fs from 'fs';
import path from 'path';

// Define the structure for a chat message
interface ChatMessage {
    type: 'user' | 'bot';
    content: Array<{ type: 'text' | 'image'; value: string }>;
}

// Path to the chat messages JSON file
const filePath = path.join(process.cwd(), 'data', 'chatMessages.json');

// Ensure the directory and file are created if they don't exist
if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

// Function to call ChatGPT API (mocked for this example)
async function getChatGptResponse(userMessage: string): Promise<string> {
    // Simulating an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    return "Esta es una respuesta generada por un robot..."; // Mock response from ChatGPT
}

// POST method for adding a new message
export async function POST(req: Request): Promise<Response> {
    try {
        const { message }: { message: string } = await req.json();

        let chatMessages: ChatMessage[] = [];

        // Read existing chat messages if the file exists
        if (fs.existsSync(filePath)) {
            const jsonData = fs.readFileSync(filePath, 'utf-8');
            chatMessages = JSON.parse(jsonData) as ChatMessage[];
        }

        // Add the new user message
        chatMessages.push({
            type: 'user',
            content: [{ type: 'text', value: message }],
        });

        // Write updated chat messages to the file
        fs.writeFileSync(filePath, JSON.stringify(chatMessages, null, 2), 'utf-8');

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error processing POST request:', error);
        return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}

// GET method for retrieving messages
export async function GET(): Promise<Response> {
    try {
        let chatMessages: ChatMessage[] = [];

        // If file does not exist, return an empty array
        if (fs.existsSync(filePath)) {
            const jsonData = fs.readFileSync(filePath, 'utf-8');
            chatMessages = JSON.parse(jsonData) as ChatMessage[];
        }

        return new Response(JSON.stringify(chatMessages), { status: 200 });
    } catch (error) {
        console.error('Error processing GET request:', error);
        return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
            status: 500,
        });
    }
}
