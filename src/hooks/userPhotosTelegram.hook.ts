import { useEffect, useState } from 'react';
import axios from 'axios';
import useHttp from "./http.hook";

async function getFilePath(fileId: string, token: string, request: (url: string, method: string) => Promise<any>) {
    const url = `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`;
    try {
        const response = await request(url, 'GET');
        return response.result.file_path;
    } catch (error) {
        console.error('Error getting file path:', error);
        return null;
    }
}

async function downloadAndSaveFile(filePath: string, request: (url: string, method: string) => Promise<any>, token: string) {
    const url = `https://api.telegram.org/file/bot${token}/${filePath}`;
    try {
        const response = await request(import.meta.env.VITE_BASE_URL + '/api/download-image', 'POST', { url });
        console.log('response download', response);
        return response;
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

function useUserPhotosTelegram(userId: number) {
    const [photos, setPhotos] = useState<any>(null);
    const { request } = useHttp();
    const token = import.meta.env.VITE_TOKEN;

    useEffect(() => {
        const fetchPhotos = async () => {
            const url = `https://api.telegram.org/bot${token}/getUserProfilePhotos?user_id=${userId}`;
            const data = await request(url, "GET");

            if (data) {
                setPhotos(data['photosData']);
                const fileId = data['result']['photos'][0][2]['file_id'];
                const filePath = await getFilePath(fileId, token, request);
                if (filePath) {
                    await downloadAndSaveFile(filePath, request, token);
                }
            }
        };

        fetchPhotos();
    }, [userId, token, request]);

    return photos;
}

export default useUserPhotosTelegram;
