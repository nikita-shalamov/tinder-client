export const createUser = () => {
    const createRandomUser = async ({ telegramId, username }: { telegramId: number; username: string }) => {
        const randomUserData = {
            telegram_id: telegramId,
            username: username,
        };

        try {
            const response = await fetch("http://localhost:5001/auth/createUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(randomUserData),
            });

            if (!response.ok) {
                throw new Error(`Could not create user, status: ${response.status}`);
            }

            return await response.json();
        } catch (e) {
            console.log(e);
        }
    };

    return { createRandomUser };
};
