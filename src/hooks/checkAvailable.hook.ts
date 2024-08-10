import useHttp from "./http.hook";

const useCheckAvailable = () => {
    const { request } = useHttp();
    
    const checkServerAvailable = async () => {
        try {
            const result = await request('/api/testget')
            console.log(result.message);
        } catch (e) {
            console.log("Тестовый запрос на /testget выдал ошибку: ", e.message);
        }
        
    }

    return {checkServerAvailable}
};

export default useCheckAvailable