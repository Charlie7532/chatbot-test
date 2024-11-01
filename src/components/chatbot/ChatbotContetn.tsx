"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatbotPanel from "./ChatbotPanel";
import MessageFromUser from "./Messages/MessageFromUser";
import MessageFromBot from "./Messages/MessageFromBot";
import chatData from '@/../data/chatMessages.json';
import ResetChatButton from "./ResetChatButton";


const ChatbotContent: React.FC = () => {
    const [chatId, setChatId] = useState<string>();
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the chat container
    const scrollAnchorRef = useRef<HTMLDivElement>(null); // Ref for scrolling to the bottom

    const addMessage = (newMessage: any) => {
        setChatMessages(prevMessages => [...prevMessages, newMessage]);
    };


    const getNewChat = async () => {
        try {
            const response = await fetch('/api/resetChat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setChatId(data.chatId);
            } else {
                console.error('Failed to reset chat');
            }
        } catch (error) {
            console.error('Error resetting chat:', error);
        }
    }

    const fetchChatMessages = async () => {
        try {
            const response = await fetch(`/api/chat?id=${chatId}`);
            if (!response.ok) {
                throw new Error(`Error fetching chat messages: ${response.statusText}`);
            }
            const data = await response.json();
            setChatMessages(data.messages);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    // Initial fetch for chat data
    useEffect(() => {
        console.log("Re-rendering page...")
        const initializeChat = async () => {
            console.log("chatId: ", chatId);
            if (!chatId) {
                console.log("Creating a new chat...")
                getNewChat();
            }
            setTimeout(async () => {
                await fetchChatMessages();
            }, 500);
        };

        initializeChat();
    }, [chatId]);

    // Scroll to the bottom whenever chatMessages change
    useEffect(() => {
        if (scrollAnchorRef.current) {
            scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);

    const triggerUpdate = () => {

        const lastMessage = chatMessages[chatMessages.length - 1];
        console.log("Last msg", lastMessage.type);
        addMessage(
            {
                type: lastMessage?.type === "bot" ? "user" : "bot",
                content: [
                    {
                        "type": "text",
                        "value": "..."
                    }
                ]
            })
        fetchChatMessages();
    };


    const handleChatReset = (id: string) => {
        setChatId(id)
        setTimeout(async () => {
            await fetchChatMessages();
        }, 500);
    }

    return (
        <div className="XDMyoA" style={{ maxHeight: '500px' }}>
            <div className="_7KiQ_w">
                <div className="SgyxGQ _1rtWjA">
                    <div className="ZoFOcA _1hUVhg v0NzYQ">
                        <div className="PEzRtA">
                            <div className="stL6ZA">
                                <div
                                    ref={chatContainerRef} // Attach ref to chat container
                                    className="x6XCCg"
                                    style={{ "--69qs7g": "16px" } as React.CSSProperties}
                                >
                                    {chatMessages.map((msg, index) => (
                                        msg.type === "bot" ? (
                                            <MessageFromBot key={index}>
                                                {msg.content.map((item: any, itemIndex: any) => {
                                                    if (item.type === "text") return <p key={itemIndex}>{item.value}</p>;
                                                    if (item.type === "image") return <img key={itemIndex} className="rounded-xl" src={item.value} alt={`bot image ${itemIndex}`} />;
                                                    return null;
                                                })}
                                            </MessageFromBot>
                                        ) : (
                                            <MessageFromUser key={index}>
                                                {msg.content.map((item: any, itemIndex: any) => {
                                                    if (item.type === "text") return <p key={itemIndex}>{item.value}</p>;
                                                    if (item.type === "image") return <img key={itemIndex} className="rounded-xl" src={item.value} alt={`user image ${itemIndex}`} />;
                                                    return null;
                                                })}
                                            </MessageFromUser>
                                        )
                                    ))}
                                    {/* Anchor for scrolling */}
                                    <div ref={scrollAnchorRef}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="YPwXew _1rtWjA XyOjeA">
                        <div className="PXSXJA">
                            <div className="b2SWlQ KqIqDg FlVsxg wqfmHQ VwlkCw"></div>
                            <div className="b2SWlQ KqIqDg FlVsxg wqfmHQ XfyU_g Rfn6xw"></div>
                        </div>
                    </div>
                </div>
            </div>

            <ResetChatButton onReset={(id) => handleChatReset(id)} />
            <ChatbotPanel trigger={triggerUpdate} chatId={chatId} />

        </div>
    );
};

export default ChatbotContent;
