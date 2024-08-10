import React from "react";
import { Link } from "react-router-dom";

interface ChatHeaderProps {
    chatId: string;
}

const ChatHeader = ({ chatId }: ChatHeaderProps) => {
    const user = {
        name: "Alex",
        avatar: "/photos/photo1.png",
    };

    return (
        <div className="chat-header">
            <div className="chat-header__wrapper">
                <div className="col">
                    <Link to="/chats" className="chat-header__back">
                        <img src="/images/icons/arrow-left.svg" alt="" />
                    </Link>
                    <Link to="/profile" className="chat-header__person">
                        <div className="chat-header__avatar">
                            <img src={user.avatar} alt="" />
                        </div>
                        <div className="chat-header__name">{user.name}</div>
                    </Link>
                </div>
                <div className="col">
                    <button className="chat-header__options">
                        <img src="/images/icons/options-dots.svg" alt="" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
