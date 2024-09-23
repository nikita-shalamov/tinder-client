import axios from "axios";

export const likesService = () => {

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

    return {getCountLikes};
};
