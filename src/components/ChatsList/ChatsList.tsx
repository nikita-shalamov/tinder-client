import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import useHttp from "../../hooks/http.hook";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
import { format, isToday, isYesterday } from "date-fns";

const ChatsList = () => {
    const [lastMessageWidth, setLastMessageWidth] = useState(window.innerWidth - 185);
    const { userData, token } = useUserContext();
    const { request } = useHttp();
    const [chats, setChats] = useState(undefined);

    const getChats = async () => {
        const response = await request(`/getChats/${userData.telegramId}`, "GET", null, {}, token);

        console.log("response getChats", response.chats);

        // const newChats = await updateChatsWithPhotos(response.chats);
        const chatsWithMessages = response.chats.filter((chat) => chat.lastMessage);

        // Сортировка по дате последнего сообщения
        chatsWithMessages.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());

        console.log("chatsWithMessages", chatsWithMessages);

        setChats(chatsWithMessages);
    };

    useEffect(() => {
        getChats();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth - 185;
            if (newWidth !== lastMessageWidth) {
                setLastMessageWidth(newWidth);
            }
        };

        // Устанавливаем начальное значение при монтировании компонента
        handleResize();

        // Добавляем обработчик события изменения размера окна
        window.addEventListener("resize", handleResize);

        // Убираем обработчик при размонтировании компонента
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [lastMessageWidth]);

    return (
        <div className="chats-list">
            <div className="chats-list__wrapper">
                <div className="chats-list__items">
                    {chats &&
                        chats.map((item, index) => {
                            return (
                                item.lastMessage && (
                                    <Link key={index} to={`/chats/${item.anotherUser.telegramId}`} className="chat-item__item">
                                        <div className="chat-item__col">
                                            <div className="chat-item__avatar">
                                                <img src={item.anotherUser.photos} alt="" />
                                            </div>
                                        </div>
                                        <div className="chat-item__col">
                                            <div className="chat-item__name">{item.anotherUser.name}</div>
                                            <div className="chat-item__last-message" style={{ width: lastMessageWidth }}>
                                                {item.lastMessage && item.lastMessage.user === userData.telegramId ? `Вы: ${item.lastMessage.content}` : item.lastMessage.content}
                                            </div>
                                        </div>
                                        <div className="chat-item__col">
                                            <div className="chat-item__time">
                                                {item.lastMessage.user === userData.telegramId && (
                                                    <img
                                                        className={item.lastMessage.isRead ? "check" : "check check-one"}
                                                        src={item.lastMessage.isRead ? "/images/icons/double-check.svg" : "/images/icons/check.svg"}
                                                        alt=""
                                                    />
                                                )}
                                                {isToday(new Date(item.lastMessage.timestamp))
                                                    ? format(new Date(item.lastMessage.timestamp), "HH:mm")
                                                    : isYesterday(new Date(item.lastMessage.timestamp))
                                                      ? "Вчера"
                                                      : format(new Date(item.lastMessage.timestamp), "dd.MM.yyyy")}
                                            </div>

                                            {item.unReadMessages !== 0 && <div className="chat-item__messages">{item.unReadMessages}</div>}
                                        </div>
                                    </Link>
                                )
                            );
                        })}
                    {!chats && (
                        <>
                            <Skeleton.Input active size={"large"} style={{ width: "100%" }} />
                            <Skeleton.Input active size={"large"} style={{ width: "100%" }} />
                            <Skeleton.Input active size={"large"} style={{ width: "100%" }} />
                            <Skeleton.Input active size={"large"} style={{ width: "100%" }} />
                        </>
                    )}
                    {chats && chats.length === 0 && <div>Лайкайте и пишите взаимным лайкам!</div>}
                </div>
            </div>
        </div>
    );
};

export default ChatsList;
