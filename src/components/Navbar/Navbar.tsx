import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useEffect, useState } from "react";
import useHttp from "../../hooks/http.hook";
import { chatService } from "../../service/Chat.service";
import { likesService } from "../../service/Likes.service";

export default function Navbar() {
    const location = useLocation();

    const [countMessages, setCountMessages] = useState(0);
    const [countLikes, setCountLikes] = useState(0);

    const { getCountUnreadChats } = chatService();
    const { getCountLikes } = likesService();

    const { userData, token } = useUserContext();

    const isActive = (path: string) => location.pathname === path;

    const getCountValues = async () => {
        try {
            const responseMessages = await getCountUnreadChats(userData.telegramId, token);
            const responseLikes = await getCountLikes(userData.telegramId, token);

            setCountMessages(responseMessages);
            setCountLikes(responseLikes);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (userData.telegramId && token) {
            getCountValues();
        }
    }, [userData.telegramId, token]);

    return (
        <nav className="navbar">
            <div className="navbar__wrapper">
                <div className="navbar__list">
                    <Link to="/home" className={`navbar__item ${isActive("/home") ? "active" : ""}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-home"
                        >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </Link>
                    <Link to="/likes" className={`navbar__item ${isActive("/likes") ? "active" : ""}`}>
                        {countLikes ? <div className="navbar__message-new">{countLikes}</div> : null}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-heart"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </Link>
                    <Link to="/chats" className={`navbar__item ${isActive("/chats") ? "active" : ""}`}>
                        {countMessages ? <div className="navbar__message-new">{countMessages}</div> : null}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-message-circle"
                        >
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                    </Link>
                    <Link to="/profile" className={`navbar__item ${isActive("/profile") ? "active" : ""}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-user"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
