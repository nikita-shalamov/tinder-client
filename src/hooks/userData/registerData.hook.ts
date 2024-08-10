import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import useHttp from "../http.hook";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const useRegisterData = () => {

    const {request} = useHttp()
    const {userId} = useUserContext()

    const [registerData, setRegisterData] = useState({
        telegramId: userId,
        name: "",
        birthDate: '',
        sex: "",
        city: "",
        photos: [],
        description: '',
        interests: []
    });
    
    const onChangeRegisterData = (newData: object) => {
        setRegisterData((prevData) => ({
            ...prevData,
            ...newData
        }));
    };
    
    const takeUserRegisterData = async (telegramId: number) => {
        try {
            const response = await request('/api/getUserData', 'POST', {telegramId})
            const {name, birthDate, sex, city, description} = response.message
            
            // return {telegramId: response.message.telegramId, name, birthDate: dayjs.utc(birthDate).tz('Europe/Moscow'), sex, city, description}
            return {telegramId: response.message.telegramId, name, birthDate, sex, city, description}
        } catch (e) {
            console.log('Ошибка при получении данных пользователя', (e as Error).message);
        }
    }

    const pushRegisterData = async (data: object) => {
        try {
            const response = await request('/api/uploadUserData', 'POST', data)
            return response
        } catch (e) {
            console.log('Ошибка при регистрации пользователя', (e as Error).message);
            
        }
    }

    const takeUserPhotos = async (userId: number) => {
        try {
            const response = await request(`/api/userPhotos`, 'POST', {userId});
            return response.data.photos
        } catch (e) {
            console.log('Ошибка при получении фото юзера', (e as Error).message);
        }
    }

    const changeUserData = async (userId: number, updateData: object) => {
        try {
            const response = await request('/api/changeUserData', 'POST', {userId, updateData})
            return response
        } catch (e) {
            console.log('Ошибка при изменении данных юзера', (e as Error).message);
        }
    }

    return {registerData, onChangeRegisterData, changeUserData, pushRegisterData, takeUserRegisterData, takeUserPhotos}
}

export default useRegisterData