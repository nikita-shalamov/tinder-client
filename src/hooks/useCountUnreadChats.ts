import React from 'react';
import useHttp from './http.hook';
import { useUserContext } from '../context/UserContext';

interface useCountUnreadChatsProps {
    userId: number
    token: string
}

const useCountUnreadChats = async (userId: number, token: string) => {

    const {request} = useHttp()
    
    const response = await request(`/getCountUnreadChats/${userId}`, "GET", {}, {}, token);
    const messages = response.messages

    return messages
};

export default useCountUnreadChats;