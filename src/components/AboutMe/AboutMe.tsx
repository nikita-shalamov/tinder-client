import { useState } from "react";
import Interests from "../Interests/Interests";
import { useUserContext } from "../../context/UserContext";

export default function AboutMe() {
    const [descrStatus, setDescrStatus] = useState<boolean>(false);

    const { userData, onChangeUserData } = useUserContext();

    const handleChangeDescr = (name: string, value: string) => {
        onChangeUserData({ [name]: value });
        setDescrStatus(value === "" ? true : false);
    };

    return (
        <>
            <div className="about-me">
                <div className="about-me__wrapper">
                    <form className="about-me__form">
                        <div className="about-me__label">Описание</div>
                        <textarea
                            value={userData.description}
                            className="about-me__descr"
                            name="description"
                            placeholder="Введите описание о себе"
                            onChange={(e) => handleChangeDescr(e.target.name, e.target.value)}
                            style={descrStatus ? { border: "1px solid #ffa39e", borderRadius: "10px", padding: "10px 5px" } : {}}
                        ></textarea>
                    </form>
                </div>
            </div>
            <Interests data={userData} label={true} />
        </>
    );
}
