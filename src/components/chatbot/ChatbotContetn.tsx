"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatbotPanel from "./ChatbotPanel";
import MessageFromUser from "./Messages/MessageFromUser";
import MessageFromBot from "./Messages/MessageFromBot";
import chatData from '@/../data/chatMessages.json';
import ResetChatButton from "./ResetChatButton";

const ChatbotContent: React.FC = () => {
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the chat container
    const scrollAnchorRef = useRef<HTMLDivElement>(null); // Ref for scrolling to the bottom

    const fetchChatMessages = async () => {
        try {
            const response = await fetch("/api/chat");
            const data = await response.json();
            setChatMessages(data);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    // Initial fetch for chat data
    useEffect(() => {
        setChatMessages(chatData);
    }, []);

    // Scroll to the bottom whenever chatMessages change
    useEffect(() => {
        if (scrollAnchorRef.current) {
            scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);

    const triggerUpdate = () => {
        fetchChatMessages();
    };


    const handleChatReset = () => {
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
            <ResetChatButton onReset={handleChatReset} />
            <ChatbotPanel trigger={triggerUpdate} />
        </div>
    );
};

export default ChatbotContent;
