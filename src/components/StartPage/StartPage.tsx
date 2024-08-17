export default function StartPage() {
    const data = {
        img: "/photos/cat.png",
        title: "Lorem ipsum dolor sit amet",
        descr: "Lorem ipsum dolor sit amet, consectetur adipisicingelit. Veritatis sapiente iure, debitis",
    };

    return (
        <div className="start-page">
            <div className="start-page__wrapper">
                <div className="start-page__image">
                    <img src={data.img} alt="" className="start-page__image" />
                </div>
                <div className="start-page__title">{data.title}</div>
                <div className="start-page__descr">{data.descr}</div>
            </div>
        </div>
    );
}
