import AboutMe from "../../components/AboutMe/AboutMe";
import Buttons from "../../components/Buttons/Buttons";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useState } from "react";
import { Alert } from "antd";

const Descr = () => {
    const { SaveButton } = Buttons;
    const navigate = useNavigate();

    const { userData, onChangeUserData, changeUserData, missingFields } = useUserContext();

    const [alert, setAlert] = useState<string | undefined>(undefined);
    const onChangeAlertError = (message: string) => {
        setAlert(message);
        setTimeout(() => setAlert(undefined), 3000);
    };

    const onChangeSave = () => {
        if (missingFields.length > 0) {
            onChangeAlertError(`Заполните все поля!`);
        } else {
            onChangeUserData(userData);
            changeUserData();
            navigate("/profile");
        }
    };

    return (
        <>
            {alert && <Alert style={{ position: "fixed", right: "20px", top: "20px", zIndex: "100" }} message={alert} type="error" showIcon />}
            <AboutMe />
            <SaveButton onClick={onChangeSave} />
        </>
    );
};

export default Descr;
