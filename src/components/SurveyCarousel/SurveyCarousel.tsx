/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useRef } from "react";
import { Carousel } from "antd";

interface surveyCarouselProps {
    photos: File[];
}

const SurveyCarousel = ({ photos }: surveyCarouselProps) => {
    // Создаем реф для компонента Carousel
    const carouselRef = useRef();

    // Обработчики для кнопок
    const goToPrev = () => {
        if (carouselRef.current) {
            // @ts-ignore
            carouselRef.current.prev(); // Перейти к предыдущему слайду
        }
    };

    const goToNext = () => {
        if (carouselRef.current) {
            // @ts-ignore
            carouselRef.current.next(); // Перейти к следующему слайду
        }
    };

    return (
        <div style={{ height: "100%" }}>
            <Carousel
                dotPosition="top"
                infinite={false}
                style={{ height: "100%" }}
                ref={carouselRef} // Присваиваем реф
                className="survey-picture__carousel"
            >
                {photos.map((item, index) => {
                    return (
                        <div key={index}>
                            <img className="survey-picture__photo" src={URL.createObjectURL(item)} alt="" />
                        </div>
                    );
                })}
            </Carousel>
            <div className="survey-picture__prev-button" onClick={goToPrev}></div>
            <div className="survey-picture__next-button" onClick={goToNext}></div>
        </div>
    );
};

export default SurveyCarousel;
