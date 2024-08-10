/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback } from "react";

const useHttp = () => {
  const request = useCallback(async (url: string, method = "GET", body: object | FormData | null = null, headers: Record<string, string> = {}) => {
    try {
      // Check if body is an instance of FormData
      if (body && !(body instanceof FormData)) {
        // If not FormData, assume JSON and stringify the body
        // @ts-ignore
        body = JSON.stringify(body);
        console.log("Request body (JSON):", body);

        // Set the content type to JSON
        headers["Content-Type"] = "application/json";
      } else if (body instanceof FormData) {
        console.log("Request body (FormData):", body);
        // If it's FormData, the Content-Type will be automatically set by the browser
      }
      // @ts-ignore
      const response = await fetch(import.meta.env.VITE_BASE_URL + url, { method, body, headers });

      console.log('Response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Что-то пошло не так");
      }

      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const data = await response.json();
        console.log("JSON data received:", data);  // Log received JSON data
        return data;
      } else {
        const blobData = await response.blob();
        console.log("Blob data received:", blobData);  // Log binary data
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
