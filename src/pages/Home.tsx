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
    const [profilesData, setProfilesData] = useState(undefined);
    const { request } = useHttp();
    const [profilesCounter, setProfileCounter] = useState(1);
    const [requestActive, setRequestActive] = useState(false);
    const [currentProfile, setCurrentProfile] = useState();
    // const [dataOfUser, setDataOfUser] = useState<{
    //     name: string;
    //     year: number;
    //     city: string;
    //     description: string;
    //     interests: string[];
    // }>({
    //     name: "",
    //     year: 0,
    //     city: "",
    //     description: "",
    //     interests: [],
    // });

    const getUsersData = async (telegramId: number, filters: { lowAge: number; highAge: number; sex: string }, page: number) => {
        setRequestActive(true);
        const data = await request("/getUserProfiles", "POST", { telegramId, filters, page });
        if (data.length === 0) {
            setRequestActive(false);
        }
        setProfiles((prevValue) => {
            return Array.isArray(prevValue) ? [...prevValue, ...data] : data;
        });
        if (data.length > 0) {
            data.map(async (element: { telegramId: number }) => {
                const dataOfUser = await getAllUserData(element.telegramId);

                setProfilesData((prevValue) => {
                    return Array.isArray(prevValue) ? [...prevValue, dataOfUser] : [dataOfUser];
                });
            });
        } else {
            if (!profiles[profilesCounter]) {
                setProfileEnd(true);
            }
        }
        setRequestActive(false);
    };

    useEffect(() => {
        console.log("userData", userData);
    }, [userData]);

    useEffect(() => {
        if (profilesCounter && filters && userData.telegramId) {
            if (profilesCounter === 0) {
                getUsersData(userData.telegramId, filters, 1);
                return;
            } else if ((profilesCounter + 1) % 3 === 0 && profilesCounter !== 0) {
                getUsersData(userData.telegramId, filters, profilesCounter / 3 + 1);
            } else if (profiles && !profiles[profilesCounter] && !requestActive) {
                console.log("setProfileEnd(true) 2");
                setProfileEnd(true);
            }
        }
    }, [profilesCounter]);

    useEffect(() => {
        if (profilesData && !profileEnd) {
            setCurrentProfile(profilesData[profilesCounter]);
        }
    }, [profilesData, profilesCounter]);

    const setCounterAndGetProfile = () => {
        setProfileCounter((prevCounter: number) => {
            const newCounter = prevCounter + 1;
            return newCounter;
        });
    };

    useEffect(() => {
        console.log(profiles, profilesData);
    }, [profiles, profilesData]);

    const onChangeLike = async () => {
        console.log(userData.telegramId, profiles[profilesCounter], profilesData[profilesCounter]);

        const response = await request("/addLike", "POST", { fromUser: userData.telegramId, toUser: profiles[profilesCounter].telegramId });

        if (response.mutual) {
            setShowMutualAnimation(true);
            setTimeout(() => {
                setShowMutualAnimation(false); // Скрываем анимацию через 3 секунды
            }, 3000);
        }

        setCounterAndGetProfile();
    };

    const onChangeDislike = async () => {
        // const response = await request("/addDislike", "POST", { fromUser: userData.telegramId, toUser: profiles[profilesCounter].telegramId });
        setCounterAndGetProfile();
    };

    useEffect(() => {
        if (filters) {
            setProfileEnd(false);
            setProfilesData(undefined);
            setCurrentProfile(undefined);
            setProfileCounter(0);
            getUsersData(userData.telegramId, filters, 0);
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

    useEffect(() => {
        if (!profiles && !requestActive) {
            console.log("setProfileEnd(true) 3");
            setProfileEnd(true);
        }
    }, [profilesData, profilesCounter, requestActive]);

    const scrollToElement = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (profileEnd && profiles) {
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
                <SurveyPicture data={currentProfile ? currentProfile : undefined} onClick={{ scrollToElement, onChangeLike, onChangeDislike }} isLoading={isLoading} />
                <SurveyInfo data={currentProfile ? currentProfile : undefined} myRef={targetRef} />
            </div>
        </div>
    );
}
