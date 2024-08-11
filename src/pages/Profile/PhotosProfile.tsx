import AddPhotos from "../../components/AddPhotos/AddPhotos";
import { useNavigate } from "react-router-dom";
import Buttons from "../../components/Buttons/Buttons";
import { useUserContext } from "../../context/UserContext";
import { useState } from "react";
import { Alert } from "antd";

const PhotosProfile = () => {
    const { SaveButton } = Buttons;
    const navigate = useNavigate();

    const { userData, onChangeUserData, pushUserPhotos, missingFields, loading, setLoading } = useUserContext();
    const [alert, setAlert] = useState<string | undefined>(undefined);
    const onChangeAlertError = (message: string) => {
        setAlert(message);
        setTimeout(() => setAlert(undefined), 3000);
    };

    const onChangeSave = () => {
        if (missingFields.includes("Фотографии")) {
            onChangeAlertError(`Добавьте не менее 3-х фото`);
        } else {
            setLoading(true);
            pushUserPhotos();
            navigate("/profile");
            setLoading(false);
        }
    };

    return (
        <>
            {alert && <Alert style={{ position: "fixed", right: "20px", top: 20, zIndex: 100, width: "calc(100% - 30px)" }} message={alert} type="error" showIcon />}
            <AddPhotos header={true} />
            <SaveButton extraClass={"add-photos__button_save"} onClick={onChangeSave} />
        </>
    );
};

export default PhotosProfile;
