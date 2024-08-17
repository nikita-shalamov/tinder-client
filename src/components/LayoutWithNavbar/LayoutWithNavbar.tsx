import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Navbar from "../Navbar/Navbar";

const LayoutWithNavbar = () => {
    const location = useLocation();

    const titleMap: Record<string, string> = {
        "/home": "Анкеты",
        "/chats": "Чаты",
        "/profile": "Профиль",
        "/likes": "Мои лайки",
        "/profile/personal-info": "Личные данные",
        "/profile/aboutme": "Обо мне",
        "/profile/photos": "Фотографии",
    };

    const normalizedPathname = location.pathname.replace(/\/$/, "");
    const currentTitle = titleMap[normalizedPathname] || "Default Title";

    const headerExist = (url: string) => {
        if (url.includes("/profile/")) {
            return <Header title={currentTitle} close={true} />;
        } else if (url.includes("/chats/")) {
            return null;
        } else {
            return <Header title={currentTitle} />;
        }
    };

    return (
        <div className="background background_min">
            <div className="background__wrapper">
                {headerExist(normalizedPathname)}
                <Outlet />
                <Navbar />
            </div>
        </div>
    );
};

export default LayoutWithNavbar;
