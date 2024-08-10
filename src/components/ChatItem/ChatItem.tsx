import { Link } from "react-router-dom";

interface ChatItemProps {
    userPhoto: string;
    userName: string;
    messageText: string;
    messageCounter: number;
    time: string;
    width: string;
    url: string;
}

const ChatItem = ({ userPhoto, userName, messageText, messageCounter, time, width, url }: ChatItemProps) => {
    return (
        <>
            <Link to={url} className="chat-item__item">
                <div className="chat-item__col">
                    <div className="chat-item__avatar">
                        <img src={userPhoto} alt="" />
                    </div>
                </div>
                <div className="chat-item__col">
                    <div className="chat-item__name">{userName}</div>
                    <div className="chat-item__last-message" style={{ width: width }}>
                        {messageText}
                    </div>
                </div>
                <div className="chat-item__col">
                    <div className="chat-item__time">{time}</div>
                    <div className="chat-item__messages">{messageCounter}</div>
                </div>
            </Link>
        </>
    );
};

export default ChatItem;
