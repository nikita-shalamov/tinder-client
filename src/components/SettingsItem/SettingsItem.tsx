import { Link } from "react-router-dom";

interface SettingsItemProps {
    icon: string;
    name: string;
    urlPage: string;
}

const SettingsItem = ({ icon, name, urlPage }: SettingsItemProps) => {
    return (
        <Link to={`${urlPage}`} className="settings-item">
            <div className="settings-item__wrapper">
                <div className="settings-item__col">
                    <div className="settings-item__icon">
                        <img src={icon} alt="" />
                    </div>
                    <div className="settings-item__name">{name}</div>
                </div>
                <div className="settings-item__col">
                    <div className="settings-item__arrow">
                        <img src="/images/icons/arrow-right-blue.svg" alt="" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SettingsItem;
