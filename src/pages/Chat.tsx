import { useState } from "react";
import ChatHeader from "../components/ChatHeader/ChatHeader";
import ChatMessages from "../components/ChatMessages/ChatMessages";
import { useParams } from "react-router-dom";

const Chat = () => {
    const { chatId } = useParams();

    return (
        <>
            <ChatHeader chatId={chatId} />
            <ChatMessages chatId={chatId} />
        </>
    );
};

export default Chat;
