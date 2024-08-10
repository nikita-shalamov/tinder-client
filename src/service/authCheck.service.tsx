export const authCheck = () => {
    const getRequest = async (url: string) => {
        const response = await fetch(`http://localhost:5001${url}`);

        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }

        return response;
    };

    const checkAuth = async (userId: number) => {
        const response = await getRequest(`/checkAuth/${userId}`);
        const data = await response.json();
        return data.data;
    };

    return { checkAuth };
};
