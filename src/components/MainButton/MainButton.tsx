interface MainButtonProps {
    text: string;
    type: number;
    onClick: () => void;
}

export default function MainButton({ onClick, text, type }: MainButtonProps) {
    return (
        <div className="main-button">
            <div className="main-button__wrapper">
                {type === 1 && (
                    <button onClick={onClick} className="main-button__button">
                        {text}
                        <img src="/images/icons/arrow-right.svg" alt="" />
                    </button>
                )}
                {type === 2 && (
                    <button onClick={onClick} className="main-button__button">
                        <img src="/images/icons/arrow-left.svg" alt="" />
                        {text}
                    </button>
                )}
                {type === 3 && (
                    <button onClick={onClick} className="main-button__button">
                        {text}
                    </button>
                )}
            </div>
        </div>
    );
}
