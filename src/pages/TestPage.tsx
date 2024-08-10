import useUserData from "../hooks/userData.hook";

const TestPage = () => {
    const userId = useUserData();

    return (
        <div>
            <h1>Загрузка файлов</h1>
            <div>{userId.id}</div>
        </div>
    );
};

export default TestPage;
