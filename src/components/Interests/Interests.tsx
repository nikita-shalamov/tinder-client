import { useUserContext } from "../../context/UserContext";

interface InterestsProps {
    label: boolean;
    textAlignLeft?: boolean;
    active?: boolean;
    profile?: boolean;
}
export default function Interests({ profile = false, label, textAlignLeft, active = true }: InterestsProps) {
    const { userData, onChangeUserData, changeUserData } = useUserContext();

    const interestsList = [
        { label: "travel", name: "Путешествия", emoji: "🌍" },
        { label: "movies", name: "Кино", emoji: "🎬" },
        { label: "music", name: "Музыка", emoji: "🎵" },
        { label: "photography", name: "Фотография", emoji: "📷" },
        { label: "cooking", name: "Кулинария", emoji: "🍳" },
        { label: "sports", name: "Спорт", emoji: "⚽" },
        { label: "art", name: "Искусство", emoji: "🎨" },
        { label: "technology", name: "Технологии", emoji: "💻" },
        { label: "literature", name: "Литература", emoji: "📚" },
        { label: "nature", name: "Природа", emoji: "🌳" },
        { label: "animals", name: "Животные", emoji: "🐾" },
        { label: "games", name: "Игры", emoji: "🎮" },
    ];
    console.log(userData.interests);
    const items = interestsList.map((item, index) => {
        if (profile) {
            if (userData.interests.includes(item.label)) {
                return (
                    <div key={index} className={"interests__item"} style={!active ? { cursor: "default" } : {}}>
                        {`${item.emoji} ${item.name}`}
                    </div>
                );
            } else {
                return;
            }
        } else {
            return (
                <div
                    key={index}
                    onClick={active ? () => selectItems(index) : undefined}
                    className={`interests__item ${userData.interests && userData.interests.includes(item.label) ? "active" : ""}`}
                    style={!active ? { cursor: "default" } : {}}
                >
                    {`${item.emoji} ${item.name}`}
                </div>
            );
        }
    });

    const selectItems = (index: number) => {
        if (userData.interests && userData.interests.includes(interestsList[index].label)) {
            const newDataInterest = userData.interests.filter((elem) => elem !== interestsList[index].label);
            onChangeUserData({ interests: newDataInterest });
        } else {
            const newDataInterest = userData.interests ? [...userData.interests, interestsList[index].label] : [interestsList[index].label];
            onChangeUserData({ interests: newDataInterest });
        }
    };

    return (
        <div className="interests">
            <div className="interests__wrapper" style={textAlignLeft ? { width: "100%", marginTop: "10px" } : {}}>
                {label && <div className="interests__label">Интересы</div>}
                <div className="interests__list" style={textAlignLeft ? { justifyContent: "flex-start" } : {}}>
                    {items}
                </div>
            </div>
        </div>
    );
}
