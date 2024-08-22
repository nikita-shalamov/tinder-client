import AddPhotos from "../../components/AddPhotos/AddPhotos";
import { useNavigate } from "react-router-dom";
import Buttons from "../../components/Buttons/Buttons";
import { useUserContext } from "../../context/UserContext";
import { useState } from "react";
import { Alert } from "antd";
import { longFormatters } from "date-fns";

const PhotosProfile = () => {
    const { SaveButton } = Buttons;
    const navigate = useNavigate();

    const { userData, onChangeUserData, pushUserPhotos, missingFields, loading, setLoading } = useUserContext();
    const [alert, setAlert] = useState<string | undefined>(undefined);
    const onChangeAlertError = (message: string) => {
        setAlert(message);
        setTimeout(() => setAlert(undefined), 3000);
    };

    const onChangeSave = async () => {
        if (missingFields.includes("Фотографии")) {
            onChangeAlertError(`Добавьте не менее 3-х фото`);
        } else {
            setLoading(true);
            const response = await pushUserPhotos();
            if (response !== undefined) {
                console.log(response);

                navigate("/profile");
                setLoading(false);
            } else {
                navigate("/error");
            }
        }
    };

    return (
        <>
            {alert && <Alert style={{ position: "fixed", right: "20px", top: 20, zIndex: 100, width: "calc(100% - 30px)" }} message={alert} type="error" showIcon />}
            <AddPhotos header={false} />
            <SaveButton extraClass={"add-photos__button_save"} onClick={onChangeSave} />
        </>
    );
};

export default PhotosProfile;
