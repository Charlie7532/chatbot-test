'use client';

import React, { useState } from 'react';
import VoiceBtn from './VoiceBtn';

interface ChatbotPanelProps {
    trigger: () => void;
}

const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ trigger }) => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setIsLoading(true);

        let messageToSend = message;
        
        setMessage('');
        trigger();

        if (message.trim() === '') return;

        // Send the message to the API

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (response.ok) {
            trigger();
        } else {
            console.error('Failed to send message');
        }
    };

    return (
        <form className="tT0YCw" onSubmit={handleSubmit} noValidate>
            <div className="JyB_vw">
                <div className="yYw_FA pr-5">
                    <div className="uLt0uw">
                        <div className="Wrk03w KbQ1bQ c7zhBg s5hqTw">

                            <input
                                className="s_JGcg fFOiLQ eoXdOg tMP70Q"
                                dir="auto"
                                type="text"
                                maxLength={800}
                                placeholder="How else can I help?"
                                aria-label="Ask Canva Assistant for help"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <VoiceBtn />
                        </div>
                    </div>
                </div>
                <div className="yYw_FA Zxv8Qg">
                    <button
                        className={`_1QoxDw Qkd66A tYI0Vw o4TrkA cclg9A G97FoQ zKTE_w Qkd66A tYI0Vw HySjhA cwOZMg zQlusQ uRvRjQ pgaA2w j_FNLg ${!message ? "ZivLog" : ""}`}
                        type="submit"
                        aria-label="Send message"
                    >
                        <span className="TcNIhA">
                            <span aria-hidden="true" className="NA_Img dkWypw">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="m12.75 7.15 4.38 4.38a.75.75 0 1 0 1.06-1.06l-4.95-4.95a1.75 1.75 0 0 0-2.48 0l-4.95 4.95a.75.75 0 0 0 1.06 1.06l4.38-4.38v11.6a.75.75 0 1 0 1.5 0V7.15z"
                                    />
                                </svg>
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ChatbotPanel;
