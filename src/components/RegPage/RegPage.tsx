import { Input, Segmented, Select } from "antd";
import { useUserContext } from "../../context/UserContext";
import { WomanOutlined, ManOutlined } from "@ant-design/icons";
import BirthDateInput from "./DateInput";
import { cities } from "../../constants/cities";

interface RegPageProps {
    setFormErrors?: React.Dispatch<React.SetStateAction<string[]>>;
}

const RegPage = ({ setFormErrors }: RegPageProps) => {
    const { userData, onChangeUserData, missingFields } = useUserContext();

    const onChangeData = (name: string, value: string) => {
        onChangeUserData({ [name]: value });
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
                            onChange={(e) => {
                                {
                                    onChangeData(e.target.name, e.target.value);
                                    e.target.value.split("").length > 12 &&
                                        setFormErrors((prevValue) => {
                                            return !Array.isArray(prevValue) ? [] : !prevValue.includes("Максимум 12 символов в имени") ? [...prevValue, "Максимум 12 символов в имени"] : prevValue;
                                        });
                                }
                            }}
                            name="name"
                            value={userData.name}
                            status={missingFields.includes("Имя") || userData.name.split("").length > 12 ? "error" : ""}
                            className="reg-page__input"
                            placeholder="Имя"
                        />
                        {userData.name && userData.name.split("").length > 12 && <div className="reg-page__input-error">{"Максимум 12 символов"}</div>}
                    </div>
                    <div className="reg-page__field">
                        <label htmlFor="birthDate" className="reg-page__label">
                            Дата рождения
                        </label>
                        {userData && <BirthDateInput defaultDate={userData.birthDate ? userData.birthDate : ""} onChange={onChangeData} />}
                    </div>
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
                            options={cities}
                            status={missingFields.includes("Город") ? "error" : ""}
                        />
                    </div>
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
