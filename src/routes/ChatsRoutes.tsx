import { Routes, Route } from "react-router-dom";
import Chats from "../pages/Chats";
import Chat from "../pages/Chat";

const ChatsRoutes = () => {
    return (
        <Routes>
            <Route path=":chatId" element={<Chat />} />
        </Routes>
    );
};

export default ChatsRoutes;
