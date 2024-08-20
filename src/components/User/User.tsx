/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import SurveyPicture from "../SurveyPicture/SurveyPicture";
import SurveyInfo from "../SurveyInfo/SurveyInfo";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import useHttp from "../../hooks/http.hook";

const User = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const userId = Number(useParams().id);
    const [loading, setLoading] = useState(true);
    const [writeButtonStatus, setWriteButtonStatus] = useState(false);
    const { request } = useHttp();

    const { getAllUserData, userData } = useUserContext();

    const [dataOfUser, setDataOfUser] = useState<{
        name: string;
        year: number;
        city: string;
        description: string;
        interests: string[];
    }>({
        name: "",
        year: 0,
        city: "",
        description: "",
        interests: [],
    });

    const onChangeGetUserData = async () => {
        const data = await getAllUserData(userId);

        //@ts-ignore
        setDataOfUser({ ...data, userId });
        setLoading(false);
    };

    useEffect(() => {
        onChangeGetUserData();
    }, [getAllUserData, setDataOfUser]);

    const navigate = useNavigate();
    const location = useLocation();

    // Функция для прокрутки к элементу
    const scrollToElement = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const onChangeLike = async () => {
        const response = await request("/addLike", "POST", { fromUser: userData.telegramId, toUser: userId });
        console.log(response);
        setWriteButtonStatus(true);
    };

    const onChangeDislike = async () => {
        const response = await request("/addDislike", "POST", { fromUser: userData.telegramId, toUser: userId });
        console.log(response);
        navigate("/likes");
    };

    const goBack = () => {
        if (location.state?.from) {
            navigate(location.state.from);
        } else {
            navigate("/likes"); // если нет информации о предыдущем маршруте
        }
    };

    return (
        <div>
            <header className="user__header" style={userId ? { padding: "10px 10px 10px 10px" } : {}}>
                <div className="user__header-wrapper">
                    <button className="user__back-button" onClick={goBack}>
                        <img src="/images/icons/arrow-left.svg" alt="" />
                    </button>
                </div>
            </header>
            <SurveyPicture writeButton={writeButtonStatus} isLoading={loading} data={dataOfUser} onClick={{ scrollToElement, onChangeLike, onChangeDislike }} />
            <SurveyInfo data={dataOfUser} myRef={targetRef} />
        </div>
    );
};

export default User;
