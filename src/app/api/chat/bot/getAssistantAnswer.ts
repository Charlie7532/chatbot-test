
export async function getChatGptResponse(userMessage: string): Promise<any> {
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
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are Templi, an AI assistant that helps users optimize Canva templates. Respond in the following JSON format:
            
                        [
                            { "type": "text", "value": "paragraph 1" },
                            { "type": "text", "value": "paragraph 2" },
                            { "type": "image", "value": "imageurl.png" },
                            { "type": "text", "value": "paragraph 3" },
                            { "type": "link", "value": "url link" }
                        ]
            
                        Each text entry should contain a single paragraph, and any image entries should include a URL under the "value" key. Include images only if specifically requested or directly relevant to the answer.
            
                        When applicable, use templates that match the user's requirements from the examples below. Each template includes "url" and "image" for previewing and "tags," "description," "style," and "theme" to help determine relevance:
            
                        [
                            {
                                "id": "0",
                                "url": "https://www.canva.com/design/DAGVFOokAGg/3qePUKipSj6IoyM89NGS-g/edit?utm_content=DAGVFOokAGg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
                                "image": "/images/original.jpg",
                                "tags": ["Original", "template"],
                                "description": "Colorful kitchen supplies",
                                "style": "Original",
                                "theme": "Kitchen"
                            },
                            {
                                "id": "1",
                                "url": "https://www.canva.com/design/DAGVFa8tQ1Q/zzLah4WzZsG8pkoJfYhMcQ/edit?utm_content=DAGVFa8tQ1Q&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
                                "image": "/images/bold.jpg",
                                "tags": ["Bold", "Image", "Engaging", "Brown"],
                                "description": "Sober kitchen design",
                                "style": "Bold",
                                "theme": "Beige Kitchen logo"
                            },
                            {
                                "id": "2",
                                "url": "https://www.canva.com/design/DAGVFA09K5g/boIMic0D3GDtVHR-MBbTqw/edit?utm_content=DAGVFA09K5g&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
                                "image": "/images/appealing.jpg",
                                "tags": ["Pub", "beer", "neutral", "white background"],
                                "description": "Old pub design with beer focus",
                                "style": "Appealing",
                                "theme": "Beige pub"
                            },
                            {
                                "id": "3",
                                "url": "https://www.canva.com/design/DAGVFX88fdc/JzqwFjFLCXpLjTxBLbf1Ow/edit?utm_content=DAGVFX88fdc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
                                "image": "/images/minimalist.jpg",
                                "tags": ["Simple", "Modern", "Basic", "Grey"],
                                "description": "Grey minimalist design",
                                "style": "Minimalist",
                                "theme": "Black and white beer"
                            }
                        ]
            
                        Use examples only if they closely match the user's requirements.
                        avoid ${"```json"} at the beguining of the answer `
                    },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 2000,
                temperature: 0.7
            }
            )
        });


        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`OpenAI API Error: ${errorMessage}`);
        }

        const data = await response.json();
        console.log("Assistant full answer: ", data.choices[0]?.message?.content);
        const botMessage = JSON.parse(data.choices[0]?.message?.content) || [{ type: "text", value: "Error: No response content" }];

        console.log("Bot answer: ", JSON.parse(data.choices[0]?.message.content));

        return botMessage;
    } catch (error) {
        console.error("Error fetching ChatGPT response:", error);
        return [{ type: "text", value: "Error generating response. Please try again later." }];
    }
}