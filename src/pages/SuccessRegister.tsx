import { Button, Result } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const SuccessRegister = (onChange: (userId: number) => void) => {
    const navigate = useNavigate();

    const { userId, setUserId, isAuthenticated, setIsAuthenticated } = useUserContext();

    const onNavigateHome = () => {
        setUserId(2);
        setIsAuthenticated(true);
    };

    return (
        <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Result
                status="success"
                title="Регистрация прошла успешно!"
                extra={[
                    <Button onClick={onNavigateHome} type="primary" key="console">
                        Открыть приложение{" "}
                    </Button>,
                ]}
            />
        </div>
    );
};

export default SuccessRegister;
