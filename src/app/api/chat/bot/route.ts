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
async function getChatGptResponse(userMessage: string): Promise<any> {
    const apiKey = process.env.OPENAI_API_KEY; // Store API key securely in environment variables
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    if (!apiKey) {
        throw new Error("Missing OpenAI API Key");
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                // model: "Templi",
                model: "gpt-4o-mini",
                // instruction:"you are Templi an ai assistant that helps optimize canva templates",
                messages: [
                    {
                        role: "system",
                        content: `you are Templi an ai assistant that helps optimize canva templates. Please respond in the following JSON format:
                         [
                                {
                                    "type": "text",
                                    "value": "paragraph 1"
                                },
                                {
                                    "type": "text",
                                    "value": "paragraph 2"
                                },
                                {
                                    "type": "image",
                                    "value": "imageurl.png"
                                },
                                {
                                    "type": "text",
                                    "value": "paragraph 3"
                                }
                            ]
                        Each text entry should be a paragraph, and image entries should include a URL under the "src" key. the use of images in the answer is optional unles the user is requesting an image. so limit the use of that. `
                    },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300,
                temperature: 0.7
            })
        });


        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`OpenAI API Error: ${errorMessage}`);
        }

        const data = await response.json();
        const botMessage = JSON.parse(data.choices[0]?.message?.content) || [{ type: "text", value: "Error: No response content" }];

        console.log("Bot answer: ", JSON.parse(data.choices[0]?.message.content));

        return botMessage;
    } catch (error) {
        console.error("Error fetching ChatGPT response:", error);
        return [{ type: "text", value: "Error generating response. Please try again later." }];
    }
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


        // Call ChatGPT to get the bot response
        const botResponse = await getChatGptResponse(message);
        chatMessages.push({
            type: 'bot',
            content: botResponse,
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
