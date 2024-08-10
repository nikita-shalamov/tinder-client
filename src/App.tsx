import { Routes, Route, useLocation, Outlet, useNavigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import ProfileRoutes from "./routes/ProfileRoutes";
import ChatsRoutes from "./routes/ChatsRoutes";
import { useEffect, useState } from "react";
import useUserData from "./hooks/userData.hook";
import LayoutWithNavbar from "./components/LayoutWithNavbar/LayoutWithNavbar";
import Error from "./pages/Error";
import Loading from "./pages/Loading";
import { useUserContext } from "./context/UserContext";
import useRegisterData from "./hooks/userData/registerData.hook";
import TestPage from "./pages/TestPage";

function ensureDocumentIsScrollable() {
    const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
    if (!isScrollable) {
        document.documentElement.style.setProperty("height", "calc(100vh + 1px)", "important");
    }
}
function preventCollapse() {
    if (window.scrollY === 0) {
        window.scrollTo(0, 1);
    }
}
const scrollableElement = document.querySelector(".background");
if (scrollableElement) {
    scrollableElement.addEventListener("touchstart", preventCollapse);
}
window.addEventListener("load", ensureDocumentIsScrollable);

export default function App() {
    const navigate = useNavigate();

    const { loading, setLoading, takeUserData, userData, isDataFetched, userPhotos, takeUserPhotos } = useUserContext();
    const userId = useUserData();

    useEffect(() => {
        if (userId.id !== undefined) {
            takeUserData(Number(userId.id));
            takeUserPhotos(Number(userId.id));
        } else {
            takeUserData(4);
            takeUserPhotos(4);
        }
    }, [userId.id]);

    useEffect(() => {
        console.log("APP", userPhotos);
    }, [userPhotos]);

    useEffect(() => {
        console.log(userData, userPhotos);

        if (isDataFetched && userData.name !== undefined) {
            navigate("/home");
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
                <Route path="/profile/*" element={<ProfileRoutes />} />
                <Route path="/chats/*" element={<ChatsRoutes />} />
            </Route>
            <Route path="/onboarding/*" element={<Onboarding />} />
            {/* <Route path="/success-register" element={<SuccessRegister onChange={handleCheckAuth} />} /> */}
            <Route path="/error" element={<Error />} />
            <Route path="/test-page" element={<TestPage />} />
        </Routes>
    );
}
