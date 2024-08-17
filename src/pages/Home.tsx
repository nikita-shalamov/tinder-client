/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from "react";
import SurveyInfo from "../components/SurveyInfo/SurveyInfo";
import SurveyPicture from "../components/SurveyPicture/SurveyPicture";
import { useUserContext } from "../context/UserContext";
import useHttp from "../hooks/http.hook";
import { Button, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
interface Profile {
    telegramId: number;
    // Добавьте другие свойства, если есть
}

export default function Home() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { getAllUserData, userData, isDataFetched } = useUserContext();
    const [isLoading, setIsLoading] = useState(true);
    const [profileEnd, setProfileEnd] = useState(false);
    const navigate = useNavigate();

    const [profiles, setProfiles] = useState<Profile[] | undefined>();

    const { request } = useHttp();
    const [profilesCounter, setProfileCounter] = useState(0);

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

    const onChangeGetNewUser = async (id: number) => {
        if (profiles && profiles[id]) {
            const data = await getAllUserData(profiles[id].telegramId);
            // @ts-ignore
            setDataOfUser(data);
            setIsLoading(false);
        } else {
            setProfileEnd(true);
        }
    };

    const getProfiles = async (telegramId: number) => {
        if (telegramId) {
            const data = await request("/getUserProfiles", "POST", { telegramId });
            setProfiles(data);
            console.log("getUserProfiles", data);
        } else {
            console.log("not request");
        }
    };

    const onChangeLike = async () => {
        setIsLoading(true);
        const response = await request("/addLike", "POST", { fromUser: userData.telegramId, toUser: profiles[profilesCounter].telegramId });
        console.log("onChangeGetNewUser", response);

        setProfileCounter((prevCounter) => {
            const newCounter = prevCounter + 1;
            onChangeGetNewUser(newCounter);
            return newCounter;
        });
    };

    const onChangeDislike = async () => {
        setIsLoading(true);
        const response = await request("/addDislike", "POST", { fromUser: userData.telegramId, toUser: profiles[profilesCounter].telegramId });
        console.log(response);

        setProfileCounter((prevCounter) => {
            const newCounter = prevCounter + 1;
            onChangeGetNewUser(newCounter);
            return newCounter;
        });
    };

    useEffect(() => {
        if (profiles) {
            onChangeGetNewUser(0);
        }
    }, [profiles]);

    useEffect(() => {
        if (userData.telegramId) {
            getProfiles(userData.telegramId);
        }
    }, [isDataFetched]);

    const scrollToElement = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (profileEnd) {
        return (
            <Result
                icon={<SmileOutlined />}
                title="Анкеты закончились) Скоро будут новые!"
                extra={
                    <Button type="primary" onClick={() => navigate("/likes")}>
                        Мои лайки
                    </Button>
                }
            />
        );
    }

    return (
        <div className="home">
            <div className="home__wrapper">
                {/* <div style={{ maxWidth: "100%", wordWrap: "break-word" }}>{data}</div> */}
                <SurveyPicture data={dataOfUser} onClick={{ scrollToElement, onChangeLike, onChangeDislike }} isLoading={isLoading} />
                <SurveyInfo data={dataOfUser} myRef={targetRef} />
            </div>
        </div>
    );
}
