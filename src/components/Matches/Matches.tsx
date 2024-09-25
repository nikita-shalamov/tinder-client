/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";

const Matches = () => {
    const { userData, getMatches } = useUserContext();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAllMatches = async () => {
            setLoading(true);
            const data = await getMatches();
            //@ts-ignore
            setProfiles(data);
            setLoading(false);
        };
        getAllMatches();
    }, [userData.telegramId]);

    return (
        <div className="matches">
            <div className="matches__wrapper">
                <div className="matches__subtitle">Взаимные лайки</div>
                <div className="matches__list">
                    {!profiles && !loading && <div>Пока что взаимных лайков нет</div>}
                    {loading &&
                        Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="matches__item">
                                <Skeleton.Image active style={{ height: "100px", width: "80px" }} />
                            </div>
                        ))}
                    {!loading &&
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
