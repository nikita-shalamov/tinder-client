import { Skeleton } from "antd";
import SurveyCarousel from "../SurveyCarousel/SurveyCarousel";
import { useNavigate } from "react-router-dom";

const SurveyPicture = ({ onClick, data, isLoading, writeButton = false }) => {
    const navigate = useNavigate();

    console.log(data, isLoading);

    return (
        <div className="survey-picture">
            <div className="survey-picture__wrapper">
                <div className="survey-picture__swipe"></div>
                <div className="survey-picture__slider">
                    {!data || !data.photos ? <Skeleton.Image active={true} style={{ height: "100%", width: "100%" }} /> : <SurveyCarousel photos={data.photos ? data.photos : []} />}
                </div>
                <div className="survey-picture__light"></div>
                <div className="survey-picture__name" style={writeButton ? { bottom: "170px" } : {}}>
                    {!data || !data.name || !data.year ? <Skeleton.Input active={true} size={"large"} /> : `${data.name}, ${data.year}`}
                </div>
                {writeButton ? (
                    <button className="button survey-picture__write-button" onClick={() => navigate(`/chats/${data.userId}`)}>
                        Написать
                    </button>
                ) : (
                    data && (
                        <>
                            <div onClick={() => onClick.onChangeDislike()} className="survey-picture__left-swipe">
                                <img src="/images/icons/dislike.svg" alt="" />
                            </div>
                            <div onClick={() => onClick.onChangeLike()} className="survey-picture__right-swipe">
                                <img src="/images/icons/like.svg" alt="" />
                            </div>
                            <div onClick={() => onClick.scrollToElement()} className="survey-picture__down-swipe">
                                <img src="/images/icons/arrow-down.svg" alt="" />
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default SurveyPicture;
