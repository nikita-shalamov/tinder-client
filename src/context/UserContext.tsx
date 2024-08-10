/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, useContext, useState, ReactNode } from "react";
import useHttp from "../hooks/http.hook";
import axios from "axios";
import dayjs from "dayjs";

interface UserContextProps {
    isAuthenticated: boolean | undefined;
    setIsAuthenticated: (authenticated: boolean) => void;
    loading: boolean;
    setLoading: (load: boolean) => void;
    userData: {
        telegramId: number | undefined;
        name: string;
        birthDate: string;
        sex: string;
        city: string;
        description: string;
        interests: string[];
    };
    setUserData: (newData: object) => void;
    userPhotos: File[];
    setUserPhotos: (newPhotos: File[]) => void;
    takeUserData: (telegramId: number) => void;
    pushUserData: () => void;
    onChangeUserData: (newData: object) => void;
    isDataFetched: boolean;
    changeUserData: () => void;
    takeUserPhotos: (telegramId: number) => void;
    pushUserPhotos: () => void;
    getMissingFields: () => void;
    missingFields: string[];
    userYear: number;
}

const userContext = createContext<UserContextProps | undefined>(undefined);

function calculateAge(birthdateString: string) {
    const birthdate = dayjs(birthdateString);
    const today = dayjs();
    return today.diff(birthdate, "year");
}

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { request } = useHttp();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const [userData, setUserData] = useState({
        telegramId: undefined,
        name: "",
        birthDate: "",
        sex: "",
        city: "",
        description: "",
        interests: [],
    });

    const [userPhotos, setUserPhotos] = useState<File[]>([]);

    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [userYear, setUserYear] = useState();

    const onChangeUserData = (newData: object) => {
        setUserData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    const takeUserData = async (telegramId: number) => {
        try {
            const response = await request("/api/takeUserData", "POST", { telegramId });
            const { name, birthDate, sex, city, description, interests } = response.message;

            onChangeUserData({ telegramId: telegramId, name, birthDate, sex, city, description, interests });
            setIsDataFetched(true);
            // @ts-ignore
            setUserYear(calculateAge(birthDate));
        } catch (e) {
            console.log("Ошибка при получении данных пользователя", (e as Error).message);
        }
    };

    const pushUserData = async () => {
        try {
            const response = await request("/api/pushUserData", "POST", userData);
            return response;
        } catch (e) {
            console.log("Ошибка при регистрации пользователя", (e as Error).message);
        }
    };

    const changeUserData = async () => {
        try {
            const response = await request("/api/changeUserData", "POST", { updateData: userData });
            return response;
        } catch (e) {
            console.log("Ошибка при изменении данных юзера", (e as Error).message);
        }
    };

    const fetchImageAsFile = async (url: string, fileName: string) => {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch image");
            }

            const blob = await response.blob();
            const file = new File([blob], fileName, { type: blob.type });

            return file;
        } catch (error) {
            console.error("Error fetching image:", error);
        }
    };

    const takeUserPhotos = async (telegramId: number) => {
        try {
            const response = await request(`/api/userPhotos`, "POST", { telegramId });
            setUserPhotos([]);

            response.photos.map(async (item: string) => {
                const imageFile = await fetchImageAsFile(`${import.meta.env.VITE_BASE_URL}/api/download/${item}`, item);
                setUserPhotos((prevPhoto) => [...prevPhoto, imageFile]);
            });

            return response;
        } catch (e) {
            console.log("Ошибка при получении фото юзера", (e as Error).message);
        }
    };

    const pushUserPhotos = async () => {
        const formData = new FormData();

        // Добавляем файлы в formData
        userPhotos.forEach((file) => {
            console.log(file); // Для отладки, убедитесь, что файл отображается правильно
            formData.append("photos", file);
        });

        // Добавляем другие данные в formData
        formData.append("telegramId", userData.telegramId);

        try {
            console.log("formData", formData);

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response;
        } catch (error) {
            console.error("Ошибка при загрузке фото", error);
        }
    };

    const getMissingFields = () => {
        setMissingFields([]);
        if (typeof userData.name !== "string" || !userData.name.trim()) setMissingFields((prevData) => [...prevData, "Имя"]);
        if (userData.birthDate === undefined) setMissingFields((prevData) => [...prevData, "Дата рождения"]);
        if (typeof userData.sex !== "string" || !userData.sex.trim()) setMissingFields((prevData) => [...prevData, "Пол"]);
        if (typeof userData.city !== "string" || !userData.city.trim()) setMissingFields((prevData) => [...prevData, "Город"]);
        if (typeof userData.description !== "string" || !userData.description.trim()) setMissingFields((prevData) => [...prevData, "Описание"]);
        if (!Array.isArray(userData.interests) || userData.interests.length === 0) setMissingFields((prevData) => [...prevData, "Интересы"]);
        if (userPhotos.length < 3) setMissingFields((prevData) => [...prevData, "Фотографии"]);
    };

    return (
        <userContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                loading,
                setLoading,
                userData,
                setUserData,
                userPhotos,
                setUserPhotos,
                onChangeUserData,
                takeUserData,
                pushUserData,
                takeUserPhotos,
                changeUserData,
                isDataFetched,
                pushUserPhotos,
                getMissingFields,
                missingFields,
                userYear,
            }}
        >
            {children}
        </userContext.Provider>
    );
};

const useUserContext = () => {
    const context = useContext(userContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { UserProvider, useUserContext };
