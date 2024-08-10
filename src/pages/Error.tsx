import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Error = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/home");
    };

    return (
        <div>
            <Result
                status="500"
                title="500"
                subTitle="Что-то пошло не так... Уже исправляем"
                extra={
                    <Button onClick={handleNavigate} type="primary">
                        На главную
                    </Button>
                }
            />
        </div>
    );
};

export default Error;
