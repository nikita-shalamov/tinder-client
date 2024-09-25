import { Skeleton } from "antd";
import SurveyCarousel from "../SurveyCarousel/SurveyCarousel";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

const SurveyPicture = ({ onClick, data, writeButton = false }) => {
    const navigate = useNavigate();
    const [position, setPosition] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [color, setColor] = useState<string>();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handlers = useSwipeable({
        onSwiping: (eventData) => {
            setPosition(eventData.deltaX);
        },
        onSwiped: () => {
            const screenThreshold = window.innerWidth * 0.6;

            if (Math.abs(position) > screenThreshold) {
                const finalPosition = position > 0 ? window.innerWidth : -window.innerWidth;
                setPosition(finalPosition);
                position > 0 ? onClick.onChangeLike() : onClick.onChangeDislike();
                setTimeout(() => {
                    setPosition(0);
                }, 100);
            } else {
                setPosition(0);
            }

            setTimeout(() => {
                setPosition(0);
            }, 500);
        },
        trackMouse: true,
    });

    useEffect(() => {
        const intensity = Math.min(Math.abs(position) / (window.innerWidth / 2), 1); // Range from 0 to 1
        const color = position > 0 ? `rgba(0, 255, 0, ${intensity})` : `rgba(255, 0, 0, ${intensity})`;
        setColor(color);
    }, [position]);

    return (
        <div
            {...handlers}
            style={{
                transform: `translateX(${position}px)`,
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.5s ease-in-out, transform 0.2s ease-out",
                position: "relative",
            }}
            className="survey-picture"
        >
            {position !== 0 ? (
                <div
                    className="survey-picture__highlight"
                    style={{
                        position: "absolute",
                        bottom: 86,
                        left: 20,
                        right: 0,
                        height: "50%",
                        background: `linear-gradient(to top, ${color}, rgba(255, 255, 255, 0) 50%)`,
                        transition: "background 0.2s ease-out",
                        zIndex: 200,
                        width: "calc(100% - 40px)",
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                    }}
                ></div>
            ) : null}
            <div className="survey-picture__wrapper">
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
