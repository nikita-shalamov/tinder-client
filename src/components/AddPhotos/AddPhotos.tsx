import { Alert } from "antd";
import { useState, ChangeEvent, useEffect, memo } from "react";
import { useUserContext } from "../../context/UserContext";
import Loading from "../../pages/Loading";

interface AddPhotosProps {
    header?: boolean;
}

const validTypes = ["image/jpeg", "image/png", "image/jpg"];

const AddPhoto = memo(({ counter, index, handleFileChange }: { counter: number; index: number; handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void }) => {
    const value = counter + index;

    return (
        <div className={"add-photos__item add-photos__item_empty"}>
            <input accept={validTypes.join(",")} onChange={handleFileChange} type="file" id={`add-file-label-${index}`} style={{ display: "none" }} />
            <label htmlFor={`add-file-label-${index}`} className={value >= 3 ? "add-photos__label" : "add-photos__label error-label"}>
                <img src="/images/icons/plus.svg" alt="" />
            </label>
        </div>
    );
});

export default function AddPhotos({ header = true }: AddPhotosProps) {
    const [photoCounter, setPhotoCounter] = useState(undefined);
    const { userPhotos, setUserPhotos, takeUserPhotosTelegram, loadingFragment } = useUserContext();

    const [photosArray, setPhotosArray] = useState<string[] | File[] | undefined>(undefined);
    setPhotosArray([]);
    useEffect(() => {
        setPhotoCounter(userPhotos.length);
    }, [userPhotos]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const maxFileSize = 5 * 1024 * 1024;

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

    const onChangePhotoTelegram = () => {
        let limit = 0;
        if (photoCounter >= 9) {
            limit = 0;
        } else {
            limit = 9 - photoCounter;
        }
        takeUserPhotosTelegram(839348503, limit);
    };

    const [alert, setAlert] = useState<string | undefined>(undefined);

    const onChangeAlertError = (message: string) => {
        setAlert(message);
        setTimeout(() => setAlert(undefined), 2500);
    };

    useEffect(() => {
        console.log(photoCounter);
    }, [photoCounter]);

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
                <div className="add-photos__header" style={header ? {} : { justifyContent: "flex-end" }}>
                    {header && <h2 className="add-photos__title">Фотографии</h2>}
                    <button className="add-photos__download" onClick={onChangePhotoTelegram}>
                        Из телеграма
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
                    {photoCounter !== undefined &&
                        photoCounter !== 0 &&
                        Array.from({ length: 9 - photoCounter }, (_, index) => <AddPhoto counter={photoCounter} index={index} key={index} handleFileChange={handleFileChange} />)}
                </div>
            </div>
        </div>
    );
}
