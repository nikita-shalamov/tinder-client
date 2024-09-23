import AddPhotos from "../components/AddPhotos/AddPhotos";
import RegPage from "../components/RegPage/RegPage";
import StartPage from "../components/StartPage/StartPage";
import AboutMe from "../components/AboutMe/AboutMe";
import MainButton from "../components/MainButton/MainButton";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import useProgress from "../hooks/progress.hook.ts";
import { Alert } from "antd";

export default function Onboarding() {
    const navigate = useNavigate();
    const paths = ["start-page", "register", "add-photos", "about-me"];

    const { progress, increaseProgress, decreaseProgress } = useProgress();
    const { pushUserData, userData, userPhotos, pushUserPhotos, getMissingFields, missingFields, loading, setLoading, isDataFetched, onChangeUserData } = useUserContext();
    const [alert, setAlert] = useState<string | undefined>(undefined);

    const onChangeAlertError = (message: string) => {
        setAlert(message);
        setTimeout(() => setAlert(undefined), 3000);
    };

    const [formErrors, setFormErrors] = useState<string[]>([]);

    useEffect(() => {
        getMissingFields();
    }, [userData, userPhotos]);

    useEffect(() => {
        console.log(formErrors);
    }, [formErrors]);

    const finishProgress = async () => {
        if (missingFields.length > 0 || formErrors.length > 0) {
            onChangeAlertError(`Заполните следующие поля: ${[...missingFields, ...formErrors].join(", ")}`);
        } else {
            try {
                setLoading(true);
                const response = await pushUserData();
                const responsePhoto = await pushUserPhotos();
                console.log("finish", response, responsePhoto);

                if (response !== undefined && responsePhoto !== undefined) {
                    setLoading(false);
                    navigate("/home");
                }
                console.log("response", response);
            } catch (e) {
                console.log("Ошибка при создании пользователя: ", (e as Error).message);
            }
        }
    };

    useEffect(() => {
        if (location.pathname === "/onboarding" || location.pathname !== `/onboarding/${paths[progress]}`) {
            navigate(`/onboarding/${paths[progress]}`);
        }
    }, [progress, userData]);

    useEffect(() => {
        if (isDataFetched && userData.name !== undefined) {
            navigate("/home");
        }
    }, [isDataFetched]);

    useEffect(() => {
        onChangeUserData({ sex: "man" });
    }, []);

    return (
        <>
            <div className="background">
                <div className="background__wrapper background__wrapper_onboarding">
                    {alert && <Alert style={{ position: "absolute", right: "20px", top: 20, zIndex: 100, width: "calc(100% - 30px)" }} message={alert} type="error" showIcon />}
                    <ProgressBar lines={4} fill={progress} />
                    <Routes>
                        <Route path="start-page" element={<StartPage />} />
                        <Route path="register" element={<RegPage setFormErrors={setFormErrors} />} />
                        <Route path="add-photos" element={<AddPhotos />} />
                        <Route path="about-me" element={<AboutMe />} />
                    </Routes>
                    <div className="onboarding__buttons">
                        {progress !== 0 && <MainButton onClick={decreaseProgress} text="Назад" type={2} />}
                        {progress !== 3 && <MainButton onClick={increaseProgress} text="Дальше" type={1} />}
                        {progress === 3 && <MainButton onClick={finishProgress} text="Завершить" type={3} />}
                    </div>
                </div>
            </div>
        </>
    );
}
