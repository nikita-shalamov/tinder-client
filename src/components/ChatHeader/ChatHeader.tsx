import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import useHttp from "../../hooks/http.hook";
import { Skeleton } from "antd";

interface ChatHeaderProps {
    chatId: string;
}

const ChatHeader = ({ chatId }: ChatHeaderProps) => {
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

    return (
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
    );
};

export default ChatHeader;
