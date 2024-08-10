import React from "react";
import SettingsItem from "../SettingsItem/SettingsItem";

const SettingsList = () => {
    const settingsData = [
        {
            icon: "/images/icons/person.svg",
            name: "Личные данные",
            urlPage: "personal-info",
        },
        {
            icon: "/images/icons/align-left.svg",
            name: "Обо мне",
            urlPage: "aboutme",
        },
        {
            icon: "/images/icons/camera.svg",
            name: "Фотографии",
            urlPage: "photos",
        },
    ];

    return (
        <div className="settings-list">
            <div className="settings-list__wrapper">
                <div className="settings-list__title">Настройки</div>
                <div className="settings-list__items">
                    {settingsData.map((item, index) => {
                        return <SettingsItem key={index} {...item} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default SettingsList;
