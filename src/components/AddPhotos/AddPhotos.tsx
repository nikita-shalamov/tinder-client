import { Alert } from "antd";
import { useState, ChangeEvent, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import Loading from "../../pages/Loading";
import axios from "axios";

interface AddPhotosProps {
    header?: boolean;
}

export default function AddPhotos({ header = true }: AddPhotosProps) {
    const [photoCounter, setPhotoCounter] = useState(0);
    const { userPhotos, setUserPhotos, takeUserPhotosTelegram, userData, loadingFragment } = useUserContext();

    useEffect(() => {
        setPhotoCounter(userPhotos.length);
    }, [userPhotos]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const maxFileSize = 5 * 1024 * 1024;
            const validTypes = ["image/jpeg", "image/png", "image/jpg"];

            if (!validTypes.includes(file.type)) {
                onChangeAlertError("Неверный тип файла. Загрузите JPEG, JPG или PNG.");
                return;
            }

            if (file.size < maxFileSize) {
                setUserPhotos([...userPhotos, file]);
            } else {
                onChangeAlertError("Максимальный размер фото 5 MB");
            }
        }
    };

    const removeFile = (index: number) => {
        const newSelectedImage = [...userPhotos];
        newSelectedImage.splice(index, 1);
        setUserPhotos(newSelectedImage);
    };

    const AddPhoto = (counter: { counter: number; index: number }) => {
        const value = counter.counter + counter.index;

        return (
            <>
                <div className={"add-photos__item add-photos__item_empty"}>
                    <input accept="image/*" onChange={handleFileChange} type="file" id="add-file-label" style={{ display: "none" }} />
                    <label htmlFor="add-file-label" className={value >= 3 ? "add-photos__label" : "add-photos__label error-label"}>
                        <img src="/images/icons/plus.svg" alt="" />
                    </label>
                </div>
            </>
        );
    };

    const onChangePhotoTelegram = () => {
        let limit = 0;
        if (photoCounter >= 9) {
            console.log("limit if", photoCounter);
            limit = 0;
        } else {
            console.log("limit else", 9 - photoCounter);

            limit = 9 - photoCounter;
        }
        takeUserPhotosTelegram(userData.telegramId, limit);
    };

    const [alert, setAlert] = useState<string | undefined>(undefined);

    const onChangeAlertError = (message: string) => {
        setAlert(message);
        setTimeout(() => setAlert(undefined), 2500);
    };

    if (loadingFragment) {
        return (
            <div className="add-photos" style={{ height: "calc(100vh - 150px)" }}>
                <Loading />
            </div>
        );
    }

    return (
        <div className="add-photos">
            <div className="add-photos__wrapper">
                {alert && <Alert style={{ position: "absolute", right: "20px", zIndex: "100" }} message={alert} type="error" showIcon />}
                <div className="add-photos__header" style={header ? {} : { display: "none" }}>
                    <h2 className="add-photos__title">Фотографии</h2>
                    <button className="add-photos__download" onClick={onChangePhotoTelegram}>
                        Загрузить из телеграма
                    </button>
                </div>
                <div className="add-photos__list">
                    {userPhotos &&
                        userPhotos.map((item, index) => {
                            return (
                                <div key={index} className={"add-photos__item"}>
                                    <button onClick={() => removeFile(index)} className={"add-photos__delete active"}>
                                        <img src="/images/icons/close.svg" alt="" />
                                    </button>
                                    {item && <img className="add-photos__photo" src={URL.createObjectURL(item)} alt="Preview" />}
                                </div>
                            );
                        })}
                    {Array.from({ length: 9 - photoCounter }, (_, index) => (
                        <AddPhoto counter={photoCounter} index={index} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
function heic2any(arg0: { blob: File; toType: string }) {
    throw new Error("Function not implemented.");
}
