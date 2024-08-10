import queryString from "query-string";

const useUserData = () => {
    const tg = window.Telegram.WebApp
    const userData = tg.initData
    const queryStringData = userData;

    const { user } = queryString.parse(queryStringData);

    return user ? JSON.parse(user as string) : {};
}

export default useUserData