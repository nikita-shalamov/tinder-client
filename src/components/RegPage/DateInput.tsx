// DateInput.tsx
import React from "react";

interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, error }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        // Разрешаем только цифры и точки, и вводим только даты формата "ДД.ММ.ГГГГ"
        if (/^\d{0,2}\.\d{0,2}\.\d{0,4}$/.test(newValue)) {
            onChange(newValue);
        }
    };

    return <input type="text" value={value} onChange={handleChange} placeholder="ДД.ММ.ГГГГ" className={`reg-page__input ${error ? "error" : ""}`} />;
};

export default DateInput;
