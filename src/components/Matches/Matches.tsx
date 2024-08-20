/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import useHttp from "../../hooks/http.hook";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";

const Matches = () => {
    const { userPhotos, userData, getMinimizeUserData, getMatches } = useUserContext();
    const { request } = useHttp();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAllMatches = async () => {
            const data = await getMatches();
            //@ts-ignore
            setProfiles(data);
            console.log(data);
            //@ts-ignore
            if (data.length > 0) {
                setLoading(false);
            } else {
                setProfiles(undefined);
            }
            setLoading(false);
        };
        getAllMatches();
    }, [request, userData.telegramId]);

    return (
        <div className="matches">
            <div className="matches__wrapper">
                <div className="matches__subtitle">Взаимные лайки</div>
                <div className="matches__list">
                    {profiles === undefined && !loading && <div>Пока что взаимных лайков нет</div>}
                    {loading &&
                        profiles !== undefined &&
                        Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="matches__item">
                                <Skeleton.Image active style={{ height: "100px", width: "80px" }} />
                            </div>
                        ))}
                    {!loading &&
                        profiles !== undefined &&
                        profiles.map((item, index) => (
                            <Link to={`/chats/${item.telegramId}`} key={index} className="matches__item">
                                {item && <img src={URL.createObjectURL(item.photo)} alt="" />}
                                <div className="matches__item-name">{item.name}</div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Matches;
