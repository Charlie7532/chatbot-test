"use client"
import React from 'react';

interface ResetChatButtonProps {
    onReset?: () => void; // Make onReset optional
}

const ResetChatButton: React.FC<ResetChatButtonProps> = ({ onReset }) => {
    const handleResetClick = async () => {
        try {
            const response = await fetch('/api/resetChat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (onReset) {
                    onReset(); // Call the provided callback if it exists
                }
                // Optionally, handle the greeting message here
                console.log(data.greeting);
            } else {
                console.error('Failed to reset chat');
            }
        } catch (error) {
            console.error('Error resetting chat:', error);
        }
    };

    return (
        <button
            className="reset-chat-button text-black"
            onClick={handleResetClick}
            aria-label="Reset chat"
        >
            New Chat
        </button>
    );
};

export default ResetChatButton;
