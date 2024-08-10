import { Button, Result } from "antd";

const SuccessRegister = () => {
    return (
        <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Result
                status="success"
                title="Регистрация прошла успешно!"
                extra={[
                    <Button type="primary" key="console">
                        Открыть приложение{" "}
                    </Button>,
                ]}
            />
        </div>
    );
};

export default SuccessRegister;
