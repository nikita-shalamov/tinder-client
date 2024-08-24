/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Input, Segmented, Select } from "antd";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useUserContext } from "../../context/UserContext";
import { WomanOutlined, ManOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import BirthDateInput from "./DateInput";

const RegPage = () => {
    const { userData, onChangeUserData, missingFields } = useUserContext();

    const onChangeData = (name: string, value: string) => {
        onChangeUserData({ [name]: value });

        console.log(value, userData);
    };

    return (
        <div className="reg-page">
            <div className="reg-page__wrapper">
                <form className="reg-page__form">
                    <div className="reg-page__field">
                        <label htmlFor="telegram_id" className="reg-page__label">
                            Telegram ID
                        </label>
                        <Input value={userData.telegramId} name="telegramId" className="reg-page__input" placeholder="Telegram ID" disabled />
                    </div>
                    <div className="reg-page__field">
                        <label htmlFor="username" className="reg-page__label">
                            Имя
                        </label>
                        <Input
                            onChange={(e) => onChangeData(e.target.name, e.target.value)}
                            name="name"
                            value={userData.name}
                            status={missingFields.includes("Имя") ? "error" : ""}
                            className="reg-page__input"
                            placeholder="Имя"
                        />
                    </div>
                    <div className="reg-page__field">
                        <label htmlFor="birthDate" className="reg-page__label">
                            Дата рождения
                        </label>
                        {userData && <BirthDateInput defaultDate={userData.birthDate ? userData.birthDate : ""} onChange={onChangeData} />}
                        {/* {userData && (
                            // <DatePicker
                            //     format={dateFormat}
                            //     onChange={(e) => onChangeData("birthDate", e)}
                            //     defaultValue={userData.birthDate !== undefined ? dayjs(userData.birthDate) : ""}
                            //     name="birthDate"
                            //     className="reg-page__input"
                            //     placeholder="Дата рождения"
                            //     status={missingFields.includes("Дата рождения") ? "error" : ""}
                            // />
                            
                        )} */}
                    </div>
                    {/* // ГОРОД */}
                    <div className="reg-page__field">
                        <label htmlFor="birthDate" className="reg-page__label">
                            Город
                        </label>
                        <Select
                            showSearch
                            className="reg-page__input"
                            placeholder="Выбери город"
                            optionFilterProp="label"
                            onChange={(e) => onChangeData("city", e)}
                            value={userData.city}
                            options={[
                                {
                                    value: "perm",
                                    label: "Пермь",
                                },
                                {
                                    value: "moscow",
                                    label: "Москва",
                                },
                            ]}
                            status={missingFields.includes("Город") ? "error" : ""}
                        />
                    </div>
                    {/* // ПОЛ */}
                    <div className="reg-page__field">
                        <label htmlFor="birthDate" className="reg-page__label">
                            Пол
                        </label>
                        <Segmented
                            className="reg-page__input-sex"
                            value={userData.sex}
                            onChange={(e) => onChangeData("sex", e)}
                            options={[
                                { label: "Мужской", value: "man", icon: <ManOutlined /> },
                                { label: "Женский", value: "woman", icon: <WomanOutlined /> },
                            ]}
                            size="large"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegPage;
