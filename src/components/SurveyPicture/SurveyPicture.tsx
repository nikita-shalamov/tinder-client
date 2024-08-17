import { Skeleton } from "antd";
import { useUserContext } from "../../context/UserContext";
import SurveyCarousel from "../SurveyCarousel/SurveyCarousel";
import useHttp from "../../hooks/http.hook";

const SurveyPicture = ({ onClick, data, isLoading }) => {
    const writeButton = false;

    const onChangeScrollToElem = () => {
        onClick.scrollToElement();
    };

    return (
        <div className="survey-picture">
            <div className="survey-picture__wrapper">
                <div className="survey-picture__swipe"></div>
                <div className="survey-picture__slider">
                    {isLoading ? <Skeleton.Image active={true} style={{ height: "100%", width: "100%" }} /> : <SurveyCarousel photos={data.photos ? data.photos : []} />}
                </div>
                <div className="survey-picture__light"></div>
                <div className="survey-picture__name" style={writeButton ? { bottom: "170px" } : {}}>
                    {isLoading ? <Skeleton.Input active={true} size={"large"} /> : `${data.name}, ${data.year}`}
                </div>

                {writeButton ? (
                    <button className="button survey-picture__write-button">Написать</button>
                ) : (
                    <>
                        <div onClick={() => onClick.onChangeDislike()} className="survey-picture__left-swipe">
                            <img src="/images/icons/dislike.svg" alt="" />
                        </div>
                        <div onClick={() => onClick.onChangeLike()} className="survey-picture__right-swipe">
                            <img src="/images/icons/like.svg" alt="" />
                        </div>
                        <div onClick={() => onClick.onChangeScrollToElem()} className="survey-picture__down-swipe">
                            <img src="/images/icons/arrow-down.svg" alt="" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SurveyPicture;
