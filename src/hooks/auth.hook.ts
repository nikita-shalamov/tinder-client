import useHttp from "./http.hook"


const useAuth = () => {
    const {request} = useHttp()

    const checkAuth = async (userId: number) => {
        try {
            const response = await request('/api/checkAuth', 'POST', {userId})
            return response
        } catch (e) {
            console.log('Ошибка при отправке запроса:', e);
        }
    }

    const createUser = async (userId: number, name: string, description: string) => {
        try {
            const response = await request('/api/createUser', 'POST', {userId, name, description})
            return response
        } catch (e) {
            console.log('Ошибка при отправке запроса:', e);
        }
    }

    return {checkAuth, createUser}
}

export default useAuth