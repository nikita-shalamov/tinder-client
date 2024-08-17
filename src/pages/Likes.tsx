/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { Badge, Button, Result, Skeleton } from "antd";
import { useCallback, useEffect, useState } from "react";

const Likes = () => {
    const { userData, getMyLikes } = useUserContext();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const changeGetMyLikes = async () => {
            const data = await getMyLikes(userData.telegramId);
            // @ts-ignore
            setProfiles(data);
            // @ts-ignore
            data.length === 0 && setProfiles(undefined);
            setLoading(false);
        };
        changeGetMyLikes();
    }, [userData]);

    return (
        <>
            {profiles === undefined && !loading && (
                <Result
                    title="Пока что нет лайков("
                    extra={
                        <Button type="primary" onClick={() => navigate("/home")}>
                            Главная
                        </Button>
                    }
                />
            )}
            {profiles !== undefined && loading && (
                <div className="likes">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="likes__card">
                            <div className="likes__photo">
                                <Skeleton.Image active style={{ height: "100%", width: "100%" }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {profiles !== undefined && !loading && (
                <div className="likes">
                    {profiles.map((profile, index) => (
                        <Link to={`/user/${profile.id}`} key={index} className="likes__card">
                            <img src={URL.createObjectURL(profile.photo)} alt={`${profile.name}`} className="likes__photo" />
                            <div className="likes__info">
                                {profile.name}, {profile.age}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            {}
        </>
    );
};

export default Likes;
