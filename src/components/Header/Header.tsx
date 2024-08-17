import { Link } from "react-router-dom";
import HeaderFilter from "../HeaderFilter/HeaderFilter";
import { useUserContext } from "../../context/UserContext";

interface HeaderProps {
    title: string;
    close?: boolean;
}

const Header = ({ title, close }: HeaderProps) => {
    const { takeUserData, takeUserPhotos, userData } = useUserContext();

    const userDataUpload = () => {
        const currentPath = location.pathname.replace(/\/$/, "");
        if (!currentPath.includes("/profile/photos")) {
            takeUserData(userData.telegramId);
        } else {
            takeUserPhotos(userData.telegramId);
        }
    };

    return (
        <header className="header">
            <div className="header__wrapper">
                <div className="header__col">
                    <div className="header__title">{title}</div>
                </div>
                <div className="header__col">
                    {close && (
                        <Link onClick={userDataUpload} to="/profile" className="button button_header-close">
                            <img src="/images/icons/close.svg" alt="" />
                        </Link>
                    )}
                    {title === "Анкеты" && <HeaderFilter />}
                </div>
            </div>
        </header>
    );
};

export default Header;
