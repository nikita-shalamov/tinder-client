/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, useContext, useState, ReactNode } from "react";
import useHttp from "../hooks/http.hook";
import axios from "axios";
import dayjs from "dayjs";
import Compressor from "compressorjs";

interface UserContextProps {
    isAuthenticated: boolean | undefined;
    setIsAuthenticated: (authenticated: boolean) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    loading: boolean;
    setLoading: (load: boolean) => void;
    loadingFragment: boolean;
    setLoadingFragment: (load: boolean) => void;
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
    takeUserPhotos: (telegramId: number, set?: boolean) => void;
    pushUserPhotos: () => void;
    getMissingFields: () => void;
    missingFields: string[];
    userYear: number;
    takeUserPhotosTelegram: (telegramId: number, limit: number) => void;
    getAllUserData: (telegramId: number) => void;
    getMyLikes: (telegramId: number) => void;
    getMinimizeUserData: (telegramId: number) => void;
    getMatches: () => void;
    fetchImageAsFile: (url: string, filename: string) => void;
    chatData: [];
    setChatData: (newData: object) => void;
    calculateAge: (birthDate: string) => void;
    filters: { lowAge: number; highAge: number; sex: string };
    setFilters: (newData: { lowAge: number; highAge: number; sex: string }) => void;
}

const userContext = createContext<UserContextProps | undefined>(undefined);
const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
        // Проверяем размер файла
        if (file.size <= 300 * 1024) {
            // Если файл меньше 300 КБ, возвращаем его без изменений
            console.log("without компресс");

            resolve(file);
            return;
        }

        new Compressor(file, {
            quality: 0.9, // Установите качество сжатия (0-1)
            maxWidth: 700, // Установите максимальную ширину
            maxHeight: 700, // Установите максимальную высоту
            success(result) {
                // Проверяем размер файла после первой попытки сжатия
                if (result.size > 400 * 1024) {
                    console.log("доп компресс");
                    // Уменьшаем качество, чтобы достичь требуемого размера
                    new Compressor(result, {
                        quality: 0.8,
                        success(resizedBlob) {
                            // Преобразуем Blob в File
                            resolve(new File([resizedBlob], file.name, { type: resizedBlob.type }));
                        },
                        error(err) {
                            reject(err);
                        },
                    });
                } else {
                    // Преобразуем Blob в File
                    console.log("usual компресс");
                    resolve(new File([result], file.name, { type: result.type }));
                }
            },
            error(err) {
                reject(err);
            },
        });
    });
};

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { request } = useHttp();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingFragment, setLoadingFragment] = useState(undefined);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [myId, setMyId] = useState();
    const [chatData, setChatData] = useState([]);
    const [filters, setFilters] = useState(undefined);

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

    function calculateAge(birthdateString: string) {
        const birthdate = dayjs(birthdateString);
        const today = dayjs();
        const age = today.diff(birthdate, "year");
        return Number(age);
    }

    const takeUserData = async (telegramId: number) => {
        try {
            const response = await request("/takeUserData", "POST", { telegramId }, {}, token);
            const { name, birthDate, sex, city, description, interests } = response.message;

            onChangeUserData({ telegramId: telegramId, name, birthDate, sex, city, description, interests });
            setIsDataFetched(true);
            // @ts-ignore
            setUserYear(calculateAge(birthDate));
        } catch (e) {
            console.log("Ошибка при получении данных пользователя", (e as Error).message);
        }
    };

    const getAllUserData = async (telegramId: number) => {
        try {
            const responseData = await request("/takeUserData", "POST", { telegramId }, {}, token);
            const responsePhotos = await request(`/userPhotos`, "POST", { telegramId }, {}, token);
            const { name, birthDate, sex, city, description, interests } = responseData.message;
            const year = calculateAge(birthDate);

            const photosUser: File[] = [];

            for (const item of responsePhotos.photos) {
                const imageFile = await fetchImageAsFile(`${import.meta.env.VITE_BASE_URL}/download/${item}`, item);
                photosUser.push(imageFile);
            }

            return { name, birthDate, year, sex, city, description, interests, photos: photosUser };
        } catch (e) {
            console.log("Ошибка при получении данных пользователя", (e as Error).message);
            return {}; // Возврат пустого объекта в случае ошибки
        }
    };

    const getMinimizeUserData = async (telegramId: number) => {
        const responseData = await request("/takeUserData", "POST", { telegramId }, {}, token);
        const responsePhotos = await request(`/userPhotos`, "POST", { telegramId }, {}, token);
        const { name, birthDate } = responseData.message;
        const year = calculateAge(birthDate);

        const userPhoto = await fetchImageAsFile(`${import.meta.env.VITE_BASE_URL}/download/${responsePhotos.photos[0]}`, responsePhotos.photos[0]);
        return { name, year, photo: userPhoto, telegramId };
    };

    const pushUserData = async () => {
        try {
            const response = await request("/pushUserData", "POST", userData, {}, token);
            return response;
        } catch (e) {
            console.log("Ошибка при регистрации пользователя", (e as Error).message);
        }
    };

    const changeUserData = async () => {
        try {
            const response = await request("/changeUserData", "POST", { updateData: userData }, {}, token);
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

    const takeUserPhotos = async (telegramId: number, set = true) => {
        try {
            const response = await request(`/userPhotos`, "POST", { telegramId }, {}, token);

            if (set) {
                setUserPhotos([]);
            }

            const downloadPhotos = await Promise.all(
                response.photos.map(async (item: string) => {
                    const imageFile = await fetchImageAsFile(`${import.meta.env.VITE_BASE_URL}/download/${item}`, item);
                    if (set) {
                        setUserPhotos((prevPhoto) => [...prevPhoto, imageFile]);
                    } else {
                        return imageFile;
                    }
                })
            );

            if (set) {
                return response;
            } else {
                return downloadPhotos;
            }
        } catch (e) {
            console.log("Ошибка при получении фото юзера", (e as Error).message);
        }
    };

    const pushUserPhotos = async () => {
        const resizedFiles = await Promise.all(userPhotos.map(resizeImage));

        const formData = new FormData();

        // Добавляем файлы в formData
        resizedFiles.forEach((file) => {
            console.log(file); // Для отладки, убедитесь, что файл отображается правильно
            // @ts-ignore
            formData.append("photos", file);
        });

        // Добавляем другие данные в formData
        formData.append("telegramId", userData.telegramId);

        try {
            console.log("formData", formData);

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // Добавляем токен
                },
            });
            return response;
        } catch (error) {
            console.error("Ошибка при загрузке фото", error);
        }
    };

    const takeUserPhotosTelegram = async (telegramId: number, limit: number) => {
        try {
            setLoadingFragment(true);
            // const response = await request(`/api/userPhotoTelegram`, "POST", { telegramId, limit });
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/userPhotoTelegram`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Добавляем токен
                },
                body: JSON.stringify({
                    telegramId: telegramId,
                    limit: limit,
                }),
            });
            setLoadingFragment(false);
            const data = await response.json();
            const files = data.files;

            const fileObjects = files.map((file) => {
                const binaryString = atob(file.data);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: file.type });
                return new File([blob], file.name, { type: file.type, lastModified: Date.now() });
            });

            fileObjects.map(async (item) => {
                setUserPhotos((prevPhoto) => [...prevPhoto, item]);
            });

            return response;
        } catch (e) {
            console.log("Ошибка при получении фото юзера", (e as Error).message);
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

    const getMatches = async () => {
        const getMatches = async () => {
            if (userData && userData.telegramId) {
                const response = await request(`/getMatches/${userData.telegramId}`);
                return response.matches;
            }
        };

        const matches = await getMatches();

        const loadProfiles = async (matches) => {
            const loadedProfiles = [];
            for (const item of matches) {
                let minimizeData;
                if (item.toUser.telegramId === userData.telegramId) {
                    minimizeData = await getMinimizeUserData(item.fromUser.telegramId);
                } else {
                    minimizeData = await getMinimizeUserData(item.toUser.telegramId);
                }
                loadedProfiles.push(minimizeData);
            }
            return loadedProfiles;
        };

        const matchesData = loadProfiles(matches);

        return matchesData;
    };

    const getMyLikes = async () => {
        const getMyLikes = async () => {
            if (userData && userData.telegramId) {
                const response = await request(`/getMyLikes/${userData.telegramId}`);

                return response.likes;
            }
        };

        const myLikes = await getMyLikes();

        const loadLikes = async (myLikes) => {
            const myLikesData = [];
            for (const item of myLikes) {
                console.log("item", item);
                const userDataMin = await getMinimizeUserData(item.fromUser.telegramId);

                myLikesData.push({
                    id: userDataMin.telegramId,
                    name: userDataMin.name,
                    age: userDataMin.year,
                    photo: userDataMin.photo,
                });
            }

            return myLikesData;
        };

        console.log("myLikes", myLikes);

        const likesData = await loadLikes(myLikes);

        return likesData;
    };

    return (
        <userContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                token,
                setToken,
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
                takeUserPhotosTelegram,
                loadingFragment,
                setLoadingFragment,
                getAllUserData,
                getMyLikes,
                getMinimizeUserData,
                getMatches,
                myId,
                setMyId,
                fetchImageAsFile,
                //@ts-ignore
                chatData,
                setChatData,
                calculateAge,
                filters,
                setFilters,
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
