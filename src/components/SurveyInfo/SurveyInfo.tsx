import Interests from "../Interests/Interests";
import { Skeleton } from "antd";
import { cities } from "../../constants/cities";

interface SurveyInfoProps {
    myRef: React.RefObject<HTMLDivElement>;
    data: {
        name: string;
        year: number;
        city: string;
        description: string;
        interests: string[];
    };
}

const SurveyInfo: React.FC<SurveyInfoProps> = ({ myRef, data }) => {
    return (
        <div ref={myRef}>
            <div className="survey-info">
                <div className="survey-info__wrapper">
                    <div className="survey-info__main-info">
                        <div className="survey-info__name">{!data || !data.name ? <Skeleton.Input active={true} size={"default"} /> : `${data.name}, ${data.year}`}</div>
                        <div className="survey-info__location">
                            <img src="/images/icons/location.svg" alt="" />
                            {data && data.city && cities.find((city) => city.value === data.city)?.label}
                        </div>
                    </div>
                    <div className="survey-info__descr">{data && data.description}</div>
                    <div className="survey-info__card">
                        <div className="survey-info__subtitle">Интересы</div>
                        <div className="survey-info__body">{data && <Interests data={data} profile={true} label={false} textAlignLeft={true} active={false} />}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyInfo;
