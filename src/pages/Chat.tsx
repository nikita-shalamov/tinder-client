import { useEffect, useState } from "react";
import ChatHeader from "../components/ChatHeader/ChatHeader";
import ChatMessages from "../components/ChatMessages/ChatMessages";
import { useParams } from "react-router-dom";

const Chat = () => {
    const { chatId } = useParams();

    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    // Функция для обновления высоты окна
    const handleResize = () => {
        setWindowHeight(window.innerHeight);
    };

    useEffect(() => {
        // Добавляем слушатель события resize
        window.addEventListener("resize", handleResize);

        // Убираем слушатель при размонтировании компонента
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="chat-wrapper" style={{ maxHeight: windowHeight }}>
            {/* <ChatHeader chatId={chatId} /> */}
            <ChatMessages chatId={chatId} />
        </div>
    );
};

export default Chat;
