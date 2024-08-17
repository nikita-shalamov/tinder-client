import React from "react";

interface SaveButtonProps {
    onClick?: () => void;
    extraClass?: string;
}

const SaveButton = ({ onClick, extraClass }: SaveButtonProps) => {
    return (
        <div className="button__wrapper button__wrapper_save">
            <button onClick={onClick} className={"button button_save " + extraClass}>
                Сохранить
            </button>
        </div>
    );
};

interface CloseButtonProps {
    extraClass: string;
}

const CloseButton = ({ extraClass }: CloseButtonProps) => {
    return (
        <div className="button__wrapper button__wrapper_save">
            <button className={"button button_close " + extraClass}>Закрыть</button>
        </div>
    );
};

const NextButton = () => {
    return <button className="button button_next">Дальше</button>;
};

const BackButton = () => {
    return (
        <button className="button button_back">
            <img src="images/icons/arrow-left.svg" alt="" />
        </button>
    );
};

const Buttons = { SaveButton, NextButton, CloseButton, BackButton };

export default Buttons;
