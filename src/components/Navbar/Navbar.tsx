import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar__wrapper">
                <div className="navbar__list">
                    <Link to="/home" className="navbar__item navbar__item_active">
                        <img src="/images/icons/heart.svg" alt="" className="navbar__icon" />
                    </Link>
                    <Link to="/likes" className="navbar__item navbar__item_active">
                        <img src="/images/icons/heart.svg" alt="" className="navbar__icon" />
                    </Link>
                    <Link to="/chats" className="navbar__item">
                        <div className="navbar__message-new">123</div>
                        <img src="/images/icons/chats.svg" alt="" className="navbar__icon" />
                    </Link>
                    <Link to="/profile" className="navbar__item navbar__item_profile">
                        <img src="/images/icons/person.svg" alt="" className="navbar__icon" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
