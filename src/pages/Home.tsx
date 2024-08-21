/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from "react";
import SurveyInfo from "../components/SurveyInfo/SurveyInfo";
import SurveyPicture from "../components/SurveyPicture/SurveyPicture";
import { useUserContext } from "../context/UserContext";
import useHttp from "../hooks/http.hook";
import { Button, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Profile {
    telegramId: number;
}

export default function Home() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { getAllUserData, userData, isDataFetched, calculateAge, filters, setFilters } = useUserContext();
    const [isLoading, setIsLoading] = useState(true);
    const [profileEnd, setProfileEnd] = useState(false);
    const navigate = useNavigate();
    const [showMutualAnimation, setShowMutualAnimation] = useState(false);

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
        const data = await request("/getUserProfiles", "POST", { telegramId });

        const minAge = filters.lowAge;
        const maxAge = filters.highAge;
        const requiredSex = filters.sex;

        const filteredProfiles = data.filter((profile: { birthDate: string; sex: { name: string } }) => {
            const age = calculateAge(profile.birthDate);
            if (requiredSex !== "all") {
                return Number(age) >= minAge && Number(age) <= maxAge && profile.sex.name === requiredSex;
            } else {
                return Number(age) >= minAge && Number(age) <= maxAge;
            }
        });

        setProfiles(filteredProfiles);
        console.log("getUserProfiles", filteredProfiles);
        console.log("getUserProfiles", data);
    };

    const onChangeLike = async () => {
        setIsLoading(true);
        const response = await request("/addLike", "POST", { fromUser: userData.telegramId, toUser: profiles[profilesCounter].telegramId });
        console.log("onChangeGetNewUser", response);

        if (response.mutual) {
            setShowMutualAnimation(true);
            setTimeout(() => {
                setShowMutualAnimation(false); // Скрываем анимацию через 3 секунды
            }, 3000);
        }

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
            if (profileEnd == true) {
                setProfileEnd(false);
            }
            setProfileCounter(0);
            setIsLoading(true);
            onChangeGetNewUser(0);
            console.log(profiles);
        }
    }, [profiles]);

    useEffect(() => {
        if (filters) {
            console.log(filters);
            setProfiles(undefined);
            getProfiles(userData.telegramId);
        }
    }, [filters]);

    useEffect(() => {
        if (userData.telegramId) {
            const localFilters = JSON.parse(localStorage.getItem("filters"));
            if (localFilters) {
                setFilters(localFilters);
            } else {
                const newFilters = { sex: "", lowAge: 0, highAge: 0 };
                userData.sex === "man" ? (newFilters.sex = "woman") : (newFilters.sex = "man");

                const currentYears = Number(calculateAge(userData.birthDate));

                currentYears - 3 < 18 ? (newFilters.lowAge = 18) : (newFilters.lowAge = currentYears - 3);
                currentYears + 3 > 100 ? (newFilters.highAge = 100) : (newFilters.highAge = currentYears + 3);

                setFilters(newFilters);
                localStorage.setItem("filters", JSON.stringify(newFilters));
            }
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
                {showMutualAnimation && (
                    <motion.div className="mutual-animation" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 1.5 }}>
                        💖 It's a Match! 💖
                    </motion.div>
                )}
                <SurveyPicture data={dataOfUser} onClick={{ scrollToElement, onChangeLike, onChangeDislike }} isLoading={isLoading} />
                <SurveyInfo data={dataOfUser} myRef={targetRef} />
            </div>
        </div>
    );
}
