import { useUserContext } from "../../context/UserContext";
import SurveyCarousel from "../SurveyCarousel/SurveyCarousel";

const SurveyPicture = ({ onClick }) => {
    const { userPhotos, userData, userYear } = useUserContext();

    return (
        <div className="survey-picture">
            <div className="survey-picture__wrapper">
                <div className="survey-picture__swipe"></div>
                <div className="survey-picture__slider">
                    <SurveyCarousel photos={userPhotos} />
                </div>
                <div className="survey-picture__light"></div>
                <div className="survey-picture__left-swipe">
                    <img src="images/icons/dislike.svg" alt="" />
                </div>
                <div className="survey-picture__right-swipe">
                    <img src="images/icons/like.svg" alt="" />
                </div>
                <div onClick={onClick} className="survey-picture__down-swipe">
                    <img src="images/icons/arrow-down.svg" alt="" />
                </div>
                <div className="survey-picture__name">
                    {userData.name}, {userYear}
                </div>
            </div>
        </div>
    );
};

export default SurveyPicture;
