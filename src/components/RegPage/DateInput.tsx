import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useUserContext } from "../../context/UserContext";

interface FormData {
    birthDate: string;
}

interface BirthDateInputProps {
    onChange: (name: string, value: string) => void;
    defaultDate: string;
}

const BirthDateInput: React.FC<BirthDateInputProps> = ({ onChange, defaultDate }) => {
    let defaultDateNormal;
    if (defaultDate !== "") {
        defaultDateNormal = dayjs(defaultDate).format("DD.MM.YYYY");
    }
    const { calculateAge } = useUserContext();
    const [errorMessage, SetErrorMessage] = useState("");

    const {
        control,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            birthDate: defaultDateNormal, // Начальное значение для предотвращения ошибки
        },
    });

    const birthDateValue = watch("birthDate");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, selectionStart } = e.target;
        let newValue = value.replace(/\D/g, "");

        // Добавляем точки на правильные позиции
        if (newValue.length > 2) {
            newValue = newValue.slice(0, 2) + "." + newValue.slice(2);
        }
        if (newValue.length > 5) {
            newValue = newValue.slice(0, 5) + "." + newValue.slice(5, 9);
        }

        // Устанавливаем новое значение
        setValue("birthDate", newValue);

        // Восстанавливаем позицию курсора
        requestAnimationFrame(() => {
            if (selectionStart !== null) {
                // Перемещаем курсор на правильную позицию
                let newCursorPosition = selectionStart;

                // Если курсор находился перед точкой, перемещаем его через точку
                if (newValue[selectionStart] === ".") {
                    newCursorPosition++;
                }

                // Если курсор находился после точки, перемещаем его в правильное место
                if (newValue[selectionStart - 1] === "." && newValue[selectionStart] !== ".") {
                    newCursorPosition++;
                }

                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        });

        // Выполняем валидацию при каждом изменении
        trigger("birthDate");
    };

    useEffect(() => {
        if (!errors.birthDate && birthDateValue) {
            const [day, month, year] = birthDateValue.split(".");

            // Преобразование в формат YYYY-MM-DDTHH:mm:ss.sssZ
            if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
                const formattedDate = dayjs(`${year}-${month}-${day}`).toISOString();
                const age = Number(calculateAge(formattedDate));
                if (age < 18) {
                    SetErrorMessage("Возраст должен быть от 18 лет");
                } else if (age > 100) {
                    SetErrorMessage("Введите корректную дату рождения");
                } else {
                    SetErrorMessage("");
                    onChange("birthDate", formattedDate);
                }
            }
        }
    }, [birthDateValue, errors.birthDate]);

    return (
        <div>
            <Controller
                name="birthDate"
                control={control}
                rules={{
                    required: "Дата рождения обязательна",
                    pattern: {
                        value: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d\d$/,
                        message: "Введите дату в формате DD.MM.YYYY",
                    },
                }}
                render={({ field }) => (
                    <div>
                        <input
                            {...field}
                            className={`reg-page__input ${errors.birthDate || !birthDateValue ? "input-error" : ""}`}
                            type="text"
                            placeholder="DD.MM.YYYY"
                            value={field.value || ""}
                            onChange={handleChange}
                        />
                        {errorMessage && <div className="reg-page__input-error">{errorMessage}</div>}
                    </div>
                )}
            />
        </div>
    );
};

export default BirthDateInput;
