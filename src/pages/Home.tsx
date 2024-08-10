import { useRef } from "react";
import SurveyInfo from "../components/SurveyInfo/SurveyInfo";
import SurveyPicture from "../components/SurveyPicture/SurveyPicture";

export default function Home() {
    const targetRef = useRef<HTMLDivElement>(null);

    // Функция для прокрутки к элементу
    const scrollToElement = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="home">
            <div className="home__wrapper">
                {/* <div style={{ maxWidth: "100%", wordWrap: "break-word" }}>{data}</div> */}
                <SurveyPicture onClick={scrollToElement} />
                <SurveyInfo myRef={targetRef} />
            </div>
        </div>
    );
}
