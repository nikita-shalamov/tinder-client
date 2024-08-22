/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useRef, useEffect } from "react";
import { ConfigProvider, Slider, InputNumber, Segmented, Button, Flex } from "antd";
import type { InputNumberProps } from "antd";
import { useUserContext } from "../../context/UserContext";

interface Filters {
    lowAge: number;
    highAge: number;
    sex: string;
}

const HeaderFilter = () => {
    const [active, setActive] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { filters, setFilters } = useUserContext();

    // @ts-ignore
    const [currentFilters, setCurrentFilters] = useState<Filters>({});

    const handleCloseWindow = () => {
        setCurrentFilters(filters);
        setActive(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setCurrentFilters(filters);
            setActive(false);
        }
    };

    const onChange = (value: number | number[]) => {
        if (Array.isArray(value)) {
            if (value[1] - value[0] <= 4) {
                return;
            }
            setCurrentFilters((prevValue) => ({ ...prevValue, lowAge: value[0], highAge: value[1] }));
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeLow: InputNumberProps<number>["onChange"] = (value) => {
        if (value !== null) {
            onChange([value, currentFilters.highAge]);
        }
    };

    const onChangeHigh: InputNumberProps<number>["onChange"] = (value) => {
        if (value !== null) {
            onChange([currentFilters.lowAge, value]);
        }
    };

    useEffect(() => {
        setCurrentFilters(filters);
    }, [filters]);

    const saveFilters = () => {
        setFilters(currentFilters);
        localStorage.setItem("filters", JSON.stringify(currentFilters));
        console.log(currentFilters);

        setActive(false);
    };

    const onChangeOpen = () => {
        setActive((prevActive) => !prevActive);
        if (filters) {
            setCurrentFilters(filters);
        } else {
            const localFilters = JSON.parse(localStorage.getItem("filters"));
            if (localFilters !== null) {
                setCurrentFilters(localFilters);
            }
        }
    };

    return (
        <div className="header-filter">
            <button className="header-filter__button" onClick={onChangeOpen}>
                <img src="/images/icons/filter.svg" alt="" />
            </button>
            {currentFilters && (
                <div className={`header-filter__wrapper ${active ? "active" : ""}`} ref={wrapperRef}>
                    <div className="header-filter__items">
                        <div className="header-filter__item">
                            <div className="header-filter__item-title">Возраст:</div>
                            <div className="header-filter__inputs">
                                <InputNumber min={18} max={100} style={{ width: "70px" }} value={currentFilters.lowAge} onChange={onChangeLow} />
                                <InputNumber min={18} max={100} style={{ width: "70px" }} value={currentFilters.highAge} onChange={onChangeHigh} />
                            </div>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: "#3384FF",
                                        controlHeight: 60,
                                    },
                                }}
                            >
                                <Slider range value={[currentFilters.lowAge, currentFilters.highAge]} defaultValue={[currentFilters.lowAge, currentFilters.highAge]} onChange={onChange} min={18} />
                            </ConfigProvider>
                        </div>
                        <div className="header-filter__item">
                            <div className="header-filter__item-title">Пол:</div>
                            <Segmented<string>
                                options={["Все", "Парни", "Девушки"]}
                                onChange={(value) => {
                                    value === "Все"
                                        ? setCurrentFilters((prevValue) => ({ ...prevValue, sex: "all" }))
                                        : value === "Парни"
                                          ? setCurrentFilters((prevValue) => ({ ...prevValue, sex: "man" }))
                                          : setCurrentFilters((prevValue) => ({ ...prevValue, sex: "woman" }));
                                }}
                                size="large"
                                value={currentFilters.sex === "all" ? "Все" : currentFilters.sex === "man" ? "Парни" : "Девушки"}
                            />
                        </div>
                        <Flex gap="small" wrap className="header-filter__buttons">
                            <Button size="large" type="primary" onClick={saveFilters}>
                                Сохранить
                            </Button>
                            <Button onClick={() => handleCloseWindow()} size="large">
                                Закрыть
                            </Button>
                        </Flex>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderFilter;
