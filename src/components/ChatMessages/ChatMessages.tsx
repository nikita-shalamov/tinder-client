import React, { useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";

// testMessages.js
const testMessages = [
    { text: "Hello, how are you?", timestamp: "2024-06-20T10:00:00Z", type: "received" },
    { text: "Hello, how are you?", timestamp: "2024-07-01T10:00:00Z", type: "received" },
    { text: "I'm good, thanks!", timestamp: "2024-07-01T10:01:00Z", type: "sent" },
    { text: "How about you?", timestamp: "2024-07-01T10:05:00Z", type: "received" },
    { text: "I'm doing great! Just working on a project.", timestamp: "2024-07-01T10:10:00Z", type: "sent" },
    { text: "Sounds interesting!", timestamp: "2024-07-02T10:15:00Z", type: "received" },
    { text: "Yeah, it's pretty exciting. I'll tell you more about it later.", timestamp: "2024-07-02T10:20:00Z", type: "sent" },
    { text: "Looking forward to it!", timestamp: "2024-07-02T10:25:00Z", type: "received" },
];

interface Message {
    text: string;
    timestamp: string;
    type: "received" | "sent";
}
interface ChatMessagesProps {
    chatId: string;
}

const ChatMessages = ({ chatId }: ChatMessagesProps) => {
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        setMessages(testMessages);
    }, [chatId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const getFormattedDate = (timestamp: string) => {
        const date = new Date(timestamp);
        if (isToday(date)) return "Сегодня";
        if (isYesterday(date)) return "Вчера";
        return format(date, "d MMMM", { locale: ru });
    };

    const groupMessagesByDate = (messages: Message[]) => {
        const groupedMessages: { date: string; messages: Message[] }[] = [];
        let currentDate: string | null = null;

        messages.forEach((message) => {
            const messageDate = getFormattedDate(message.timestamp);
            if (messageDate !== currentDate) {
                groupedMessages.push({ date: messageDate, messages: [message] });
                currentDate = messageDate;
            } else {
                groupedMessages[groupedMessages.length - 1].messages.push(message);
            }
        });

        return groupedMessages;
    };
    const groupedMessages = groupMessagesByDate(messages);

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return; // Не отправлять пустое сообщение

        const now = new Date().toISOString();
        const newMessageObject: Message = {
            text: newMessage,
            timestamp: now,
            type: "sent",
        };

        setMessages([...messages, newMessageObject]);
        setNewMessage(""); // Очистить поле ввода
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <>
            <div className="background-messages">
                <section className="message-area">
                    {groupedMessages.map((group, index) => (
                        <React.Fragment key={index}>
                            <div className="date">{group.date}</div>
                            {group.messages.map((message, index) => (
                                <div key={index} className={`message ${message.type}`}>
                                    <p>{message.text}</p>
                                    <span className="timestamp">{format(new Date(message.timestamp), "HH:mm")}</span>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                    <div ref={messagesEndRef} />
                </section>
                <footer className="message-input">
                    <input type="text" value={newMessage} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Type a message" />
                    <button type="button" onClick={handleSendMessage}>
                        Send
                    </button>
                </footer>
            </div>
        </>
    );
};

export default ChatMessages;
