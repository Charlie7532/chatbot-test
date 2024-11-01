
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
                // model: "Templi",
                model: "gpt-4o",
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