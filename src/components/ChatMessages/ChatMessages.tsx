/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";
import { useUserContext } from "../../context/UserContext";
import useHttp from "../../hooks/http.hook";
import io from "socket.io-client";
import { Skeleton } from "antd";
import { Link, useLocation } from "react-router-dom";

const socket = io("https://shalamov-nikita.ru");
// const socket = io("http://localhost:3000");

interface Message {
    text: string;
    timestamp: string;
    type: "received" | "sent";
    isRead: boolean;
    userId: number;
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
    const [isFetched, setIsFetched] = useState(undefined);
    const { userData, token } = useUserContext();
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

    const location = useLocation();
    const { chatData, getMinimizeUserData } = useUserContext();
    const [userHeader, setUserHeader] = useState(undefined);

    const getChatData = async () => {
        const response = await getMinimizeUserData(Number(chatId));
        setUserHeader(response);
    };

    useEffect(() => {
        getChatData();
    }, []);

    const getMessages = async () => {
        const response = await request(`/getMessages/${room}`, "GET", null, {}, token);
        const messagesList = [];
        response.messages.map((item) => {
            messagesList.push({
                type: item.user === userData.telegramId ? "sent" : "received",
                text: item.content,
                timestamp: item.timestamp,
                isRead: item.isRead, // Добавляем это поле
                userId: item.user,
            });
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
        if (inputRef.current) {
            inputRef.current.focus(); // Focus the input after sending the message
        }
        if (content !== "") {
            setCurrentMessage("");
            socket.emit("message", { room, user: userData.telegramId, message: content, timestamp });
            await request("/addMessage", "POST", { room, user: userData.telegramId, content, timestamp }, {}, token);
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
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        type: message.user === userData.telegramId ? "sent" : "received",
                        text: message.message,
                        timestamp: new Date().toISOString(),
                        isRead: message.isRead,
                        userId: message.user,
                    },
                ]);
            });

            socket.on("markRead", (user) => {
                setMessages((prevMessages) => {
                    if (!prevMessages) return prevMessages;

                    return prevMessages.map((item) => {
                        if ((item.isRead === false || item.isRead === undefined) && item.userId !== user.user) {
                            return { ...item, isRead: true }; // Update isRead status
                        }
                        return item;
                    });
                });
            });

            return () => {
                socket.off("message");
                socket.off("markRead");
            };
        }
    }, [room]);

    useEffect(() => {
        if (messages) {
            const groupedMessagesList = groupMessagesByDate(messages);
            setGroupedMessages(groupedMessagesList);
            if (!isFetched) {
                setIsFetched(true);
            }
        }
    }, [messages]);

    useEffect(() => {
        if (isFetched && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ block: "end" });
        }
    }, [isFetched]);

    const markMessagesAsRead = async () => {
        await request(`/markMessagesAsRead/${room}`, "POST", { userId: userData.telegramId });
        socket.emit("markRead", { user: userData.telegramId, room: room });
    };

    useEffect(() => {
        if (room) {
            markMessagesAsRead();
        }
    }, [room]);

    useEffect(() => {
        if (isFetched && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [groupedMessages]);

    useEffect(() => {
        if (room) {
            const observer = new IntersectionObserver((entries) => {
                const lastMessageEntry = entries[0];
                if (lastMessageEntry.isIntersecting) {
                    console.log("Последнее сообщение прочитано.");
                    markMessagesAsRead();
                }
            });

            if (messagesEndRef.current) {
                observer.observe(messagesEndRef.current);
            }

            return () => {
                if (messagesEndRef.current) {
                    observer.unobserve(messagesEndRef.current);
                }
            };
        }
    }, [room]);

    return (
        <>
            <div className="background-messages">
                <>
                    {!userHeader && (
                        <div className="chat-header">
                            <div className="chat-header__wrapper">
                                <div className="col">
                                    <Link to="/chats" className="chat-header__back">
                                        <img src="/images/icons/arrow-left.svg" alt="" />
                                    </Link>
                                    <Link to="/profile" className="chat-header__person">
                                        <div className="chat-header__avatar">
                                            <Skeleton.Avatar active={true} shape={"circle"} style={{ height: "100%", width: "100%", borderRadius: "100%", overflow: "hidden" }} />
                                        </div>
                                        <Skeleton.Input active={true} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                    {userHeader && (
                        <div className="chat-header">
                            <div className="chat-header__wrapper">
                                <div className="col">
                                    <Link to="/chats" className="chat-header__back">
                                        <img src="/images/icons/arrow-left.svg" alt="" />
                                    </Link>
                                    <Link to={`/user/${chatId}`} state={{ from: location.pathname }} className="chat-header__person">
                                        <div className="chat-header__avatar">
                                            <img src={URL.createObjectURL(userHeader.photo)} alt="" />
                                        </div>
                                        <div className="chat-header__name">{userHeader.name}</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </>
                <section className="message-area">
                    {groupedMessages &&
                        groupedMessages.map((group, index) => (
                            <React.Fragment key={index}>
                                <div className="date">{group.date}</div>
                                {group.messages.map((message, index) => (
                                    <div key={index} className={`message ${message.type}`}>
                                        <p>{message.text}</p>
                                        <span className={message.isRead ? "timestamp" : "timestamp timestamp-one"}>
                                            {format(new Date(message.timestamp), "HH:mm")}
                                            {message.type === "sent" && (
                                                <img
                                                    className={message.isRead ? "check" : "check check-one"}
                                                    src={message.isRead ? "/images/icons/double-check.svg" : "/images/icons/check.svg"}
                                                    alt=""
                                                />
                                            )}
                                        </span>
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
                    <div ref={messagesEndRef} />
                </section>
                <footer className="message-input">
                    <input ref={inputRef} type="text" placeholder="Type a message" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyDown={handleKeyDown} />
                    <button
                        type="submit"
                        onClick={(event) => {
                            event.preventDefault();
                            sendMessage(currentMessage, new Date());
                        }}
                    >
                        Send
                    </button>
                </footer>
            </div>
        </>
    );
};

export default ChatMessages;
