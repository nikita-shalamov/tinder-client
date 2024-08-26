/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback } from "react";

const useHttp = () => {
  const request = useCallback(async (
    url: string, 
    method = "GET", 
    body: object | FormData | null | string = null, 
    headers: Record<string, string> = {},
    token: string | null = null  // Добавляем токен как параметр
  ) => {
    try {
      // Если токен есть, добавляем его в заголовок Authorization
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Если body не FormData, сериализуем в JSON
      if (body && !(body instanceof FormData)) {
        body = JSON.stringify(body);
        console.log("Request body (JSON):", body);
        headers["Content-Type"] = "application/json";
      } else if (body instanceof FormData) {
        console.log("Request body (FormData):", body);
      }

      // Отправляем запрос
      //@ts-ignore
      const response = await fetch(import.meta.env.VITE_BASE_URL + url, { method, body, headers });

      console.log('Response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Что-то пошло не так");
      }

      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const data = await response.json();
        console.log("JSON data received:", data);
        return data;
      } else {
        const blobData = await response.blob();
        console.log("Blob data received:", blobData);
        return blobData;
      }
    } catch (e) {
      console.log("Error in catch:", (e as Error).message);
      throw e;
    }
  }, []);

  return { request };
};

export default useHttp;
