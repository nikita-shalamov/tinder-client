import { Routes, Route, useNavigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import ProfileRoutes from "./routes/ProfileRoutes";
import ChatsRoutes from "./routes/ChatsRoutes";
import { useEffect } from "react";
import useUserData from "./hooks/userData.hook";
import LayoutWithNavbar from "./components/LayoutWithNavbar/LayoutWithNavbar";
import Error from "./pages/Error";
import Loading from "./pages/Loading";
import { useUserContext } from "./context/UserContext";
import Likes from "./pages/Likes";
import User from "./components/User/User";
import useHttp from "./hooks/http.hook";
import axios from "axios";
import Chats from "./pages/Chats";

export default function App() {
    const navigate = useNavigate();

    const { loading, setLoading, takeUserData, userData, isDataFetched, takeUserPhotos, token, setToken } = useUserContext();
    const { request } = useHttp();
    const userId = useUserData();

    useEffect(() => {
        const checkAuthToken = async (user: number) => {
            try {
                const response = await request("/login", "POST", { telegramId: user });

                localStorage.setItem("token", response.token);
                setToken(response.token);

                axios.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
            } catch (e) {
                console.error("Authentication failed", e);
                navigate("/onboarding");
            }
        };

        if (userId.id !== undefined) {
            checkAuthToken(userId.id);
        }
    }, [userId.id]);

    useEffect(() => {
        if (token !== null) {
            takeUserData(Number(userId.id));
            takeUserPhotos(Number(userId.id));
        }
    }, [token]);

    useEffect(() => {
        if (isDataFetched && userData.name !== undefined) {
            setLoading(false);
        } else if (isDataFetched && userData.name === undefined) {
            navigate("/onboarding");
            setLoading(false);
        }
    }, [isDataFetched]);

    if (loading) {
        return <Loading />;
    }

    return (
        <Routes>
            <Route element={<LayoutWithNavbar />}>
                <Route path="/home" element={<Home />} />
                <Route path="/likes" element={<Likes />} />
                <Route path="/profile/*" element={<ProfileRoutes />} />
                <Route path="/chats" element={<Chats />}></Route>
            </Route>
            <Route path="/chats/*" element={<ChatsRoutes />} />
            <Route path="/onboarding/*" element={<Onboarding />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/error" element={<Error />} />
        </Routes>
    );
}
