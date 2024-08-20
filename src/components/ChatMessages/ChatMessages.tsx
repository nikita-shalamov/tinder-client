/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";
import { useUserContext } from "../../context/UserContext";
import useHttp from "../../hooks/http.hook";
import io from "socket.io-client";
import { Skeleton } from "antd";

const socket = io("https://shalamov-nikita.ru");

interface Message {
    text: string;
    timestamp: string;
    type: "received" | "sent";
}

interface GroupedMessage {
    date: string;
    messages: Message[];
}

interface ChatMessagesProps {
    chatId: string;
}

const ChatMessages = ({ chatId }: ChatMessagesProps) => {
    const [messages, setMessages] = useState<Message[] | undefined>(undefined);
    const [room, setRoom] = useState<string | undefined>(undefined);
    const [currentMessage, setCurrentMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[] | undefined>(undefined);

    const { userData } = useUserContext();
    const { request } = useHttp();

    const getFormattedDate = (timestamp: string) => {
        const date = new Date(timestamp);
        if (isToday(date)) return "Сегодня";
        if (isYesterday(date)) return "Вчера";
        return format(date, "d MMMM", { locale: ru });
    };

    const checkRoom = async () => {
        const response = await request("/checkRoom", "POST", { firstUser: userData.telegramId, secondUser: Number(chatId) });
        if (!response.message) {
            setRoom(response.room._id);
        } else {
            setRoom(response.room);
        }
    };

    const getMessages = async () => {
        const response = await request(`/getMessages/${room}`);
        const messagesList = [];
        response.messages.map((item) => {
            messagesList.push({ type: item.user === userData.telegramId ? "sent" : "received", text: item.content, timestamp: item.timestamp });
        });
        return messagesList;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage(currentMessage, currentTime);
        }
    };

    const sendMessage = async (content: string, timestamp: Date) => {
        if (content !== "") {
            setCurrentMessage("");
            socket.emit("message", { room, user: userData.telegramId, message: content, timestamp });
            await request("/addMessage", "POST", { room, user: userData.telegramId, content, timestamp });
            if (inputRef.current) {
                inputRef.current.focus(); // Focus the input after sending the message
            }
        }
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

    useEffect(() => {
        checkRoom();
    }, [chatId, userData]);

    const setMessagesData = async () => {
        const data = await getMessages();
        setMessages(data);
    };

    useEffect(() => {
        if (room) {
            setMessagesData();
            // подключение к комнате
            socket.emit("joinRoom", room);

            // обработчик сообщений
            socket.on("message", (message) => {
                console.log(message, userData.telegramId);

                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        type: message.user === userData.telegramId ? "sent" : "received",
                        text: message.message,
                        timestamp: new Date().toISOString(), // Преобразуем в строку ISO
                    },
                ]);
            });

            // очистка обработчика сообщений
            return () => {
                socket.off("message");
            };
        }
    }, [room]);

    useEffect(() => {
        // Прокрутка контейнера сообщений до низа сразу

        if (messages) {
            const groupedMessagesList = groupMessagesByDate(messages);
            setGroupedMessages(groupedMessagesList);
        }
    }, [messages]);

    useEffect(() => {
        if (groupedMessages && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ block: "end" });
        }
    }, [groupedMessages]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <>
            <div className="background-messages">
                <section className="message-area">
                    {groupedMessages &&
                        groupedMessages.map((group, index) => (
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
                    {!groupedMessages && (
                        <>
                            <Skeleton.Input active className="received" size={"large"} style={{ width: 200 }} />
                            <Skeleton.Input active className="received" size={"large"} style={{ width: 120 }} />
                            <Skeleton.Input active size={"large"} style={{ width: 80 }} />
                            <Skeleton.Input active size={"large"} style={{ width: 100 }} />
                            <Skeleton.Input active className="received" size={"large"} style={{ width: 160 }} />
                            <Skeleton.Input active className="received" size={"large"} style={{ width: 180 }} />
                            <Skeleton.Input active className="received" size={"large"} style={{ width: 120 }} />
                        </>
                    )}
                </section>
                <footer className="message-input">
                    <input ref={inputRef} type="text" placeholder="Type a message" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyDown={handleKeyDown} />
                    <button type="submit" onClick={() => sendMessage(currentMessage, new Date())}>
                        Send
                    </button>
                </footer>
            </div>
            <div ref={messagesEndRef} style={{ marginTop: 10 }} />
        </>
    );
};

export default ChatMessages;
