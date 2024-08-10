import { useState, useRef, useEffect } from "react";
import { ConfigProvider, Slider, InputNumber } from "antd";
import type { InputNumberProps } from "antd";

const HeaderFilter = () => {
    const [active, setActive] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [age, setAge] = useState({
        low: 20,
        high: 25,
    });

    const handleFilterOpen = () => {
        setActive((prevActive) => !prevActive);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setActive(false);
        }
    };

    const onChange = (value: number | number[]) => {
        if (Array.isArray(value)) {
            if (value[1] - value[0] <= 4) {
                return;
            }
            setAge({ low: value[0], high: value[1] });
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const onChangeLow: InputNumberProps<number>["onChange"] = (value) => {
        if (value !== null) {
            onChange([value, age.high]);
        }
    };

    const onChangeHigh: InputNumberProps<number>["onChange"] = (value) => {
        if (value !== null) {
            onChange([age.low, value]);
        }
    };

    return (
        <div className="header-filter">
            <button className="header-filter__button" onClick={handleFilterOpen}>
                <img src="/images/icons/filter.svg" alt="" />
            </button>
            <div className={`header-filter__wrapper ${active ? "active" : ""}`} ref={wrapperRef}>
                <div className="header-filter__items">
                    <div className="header-filter__item">
                        <div className="header-filter__item-title">Возраст:</div>
                        <div className="header-filter__inputs">
                            <InputNumber min={18} max={100} style={{ width: "70px" }} value={age.low} onChange={onChangeLow} />
                            <InputNumber min={18} max={100} style={{ width: "70px" }} value={age.high} onChange={onChangeHigh} />
                        </div>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: "#3384FF",
                                    controlHeight: 60,
                                },
                            }}
                        >
                            <Slider range value={[age.low, age.high]} defaultValue={[age.low, age.high]} onChange={onChange} min={18} />
                        </ConfigProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderFilter;
