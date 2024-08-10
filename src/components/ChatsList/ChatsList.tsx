import React, { useRef, useEffect, useState } from "react";
import ChatItem from "../ChatItem/ChatItem";

const ChatsList = () => {
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const [lastMessageWidth, setLastMessageWidth] = useState<string | number>("auto");

    useEffect(() => {
        if (lastMessageRef.current) {
            const width = window.innerWidth - lastMessageRef.current.offsetWidth - 105;
            setLastMessageWidth(width);
        }
    }, []);

    const chatsData = [
        {
            userPhoto: "/photos/photo1.png",
            userName: "Alex",
            messageText: "please, buy groceries",
            messageCounter: 1,
            time: "11:40 AM",
            url: "chat1",
        },
        {
            userPhoto: "/photos/photo2.png",
            userName: "Alex",
            messageText: "please, buy groceries",
            messageCounter: 1,
            time: "11:40 AM",
            url: "",
        },
        {
            userPhoto: "/photos/photo3.png",
            userName: "Alex",
            messageText: "please, buy groceries",
            messageCounter: 1,
            time: "11:40 AM",
            url: "",
        },
    ];

    return (
        <div className="chats-list">
            <div className="chats-list__wrapper">
                <div className="chats-list__items">
                    {chatsData.map((item, index) => {
                        return <ChatItem key={index} {...item} width={String(lastMessageWidth)} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChatsList;
