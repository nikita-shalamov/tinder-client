import axios from "axios";

export const chatService = () => {
    const getCountUnreadChats = async (telegramId: number, token: string) => {        
        try {
            const responseCountMessages = await axios.get<{unReadCounter: number}>(`${import.meta.env.VITE_BASE_URL}/getCountUnreadChats/${telegramId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
            return responseCountMessages.data.unReadCounter
            // const responseLikes = await request(`/getCountLikes/${userData.telegramId}`, "GET", null, {}, token);
            // setCountLikes(responseLikes.likesCounter);
        } catch (e) {
            console.error('Error fetching unread chats count:', e);
        }
    };

    const getCountLikes = async (telegramId: number, token: string) => {        
        try {
            const responseCountLikes = await axios.get<{likesCounter: number}>(`${import.meta.env.VITE_BASE_URL}/getCountLikes/${telegramId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
            return responseCountLikes.data.likesCounter
        } catch (e) {
            console.error('Error fetching unread chats count:', e);
        }
    };

    return {getCountUnreadChats};
};
