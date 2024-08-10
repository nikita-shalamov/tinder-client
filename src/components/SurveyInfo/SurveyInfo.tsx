import dayjs from "dayjs";
import { useUserContext } from "../../context/UserContext";
import useUserData from "../../hooks/userData.hook";
import Interests from "../Interests/Interests";

interface SurveyInfoProps {
    myRef: React.RefObject<HTMLDivElement>;
}

const SurveyInfo: React.FC<SurveyInfoProps> = ({ myRef }) => {
    const { userData, userYear } = useUserContext();

    const cities = {
        perm: "Пермь",
        moscow: "Москва",
    };
    return (
        <div ref={myRef}>
            <div className="survey-info">
                <div className="survey-info__wrapper">
                    <div className="survey-info__main-info">
                        <div className="survey-info__name">
                            {userData.name}, {userYear}
                        </div>
                        <div className="survey-info__location">
                            <img src="/images/icons/location.svg" alt="" />
                            {cities[userData.city]}
                        </div>
                    </div>
                    <div className="survey-info__descr">{userData.description}</div>
                    <div className="survey-info__card">
                        <div className="survey-info__subtitle">Интересы</div>
                        <div className="survey-info__body">
                            <Interests profile={true} label={false} textAlignLeft={true} active={false} />
                        </div>
                    </div>
                    {/* <div className="survey-info__card">
                        <div className="survey-info__subtitle">Музыка</div>
                        <div className="survey-info__body"></div>
                    </div>
                    <div className="survey-info__card">
                        <div className="survey-info__subtitle">Личное</div>
                        <div className="survey-info__body"></div>
                    </div>
                    <div className="survey-info__card">
                        <div className="survey-info__subtitle">Образование</div>
                        <div className="survey-info__body"></div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default SurveyInfo;
