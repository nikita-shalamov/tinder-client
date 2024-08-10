import React, { useState, useRef, useEffect } from "react";

const TestHomeAnket = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [initialTouch, setInitialTouch] = useState({ x: 0, y: 0 });
    const divBlockRef = useRef<HTMLDivElement | null>(null);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        const touch = e.touches[0];
        setInitialTouch({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y,
        });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (isDragging) {
            const touch = e.touches[0];
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            const newX = touch.clientX - initialTouch.x;
            const newY = touch.clientY - initialTouch.y;

            // Пороговые значения для выхода за экран
            const thresholdX = screenWidth * 0.3;
            const thresholdY = screenHeight * 0.3;

            // Проверка выхода за пределы экрана
            if (newX < -thresholdX || newX > screenWidth + thresholdX || newY < -thresholdY || newY > screenHeight + thresholdY) {
                // Если элемент выходит за пределы экрана, можно изменить его положение или скрыть
                // В данном случае, просто сбрасываем состояние перетаскивания
                setIsDragging(false);
                return;
            }

            setPosition({ x: newX, y: newY });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        // Если требуется обработка изменения размера экрана
        const handleResize = () => {
            // Обновите любые состояния или переменные, зависящие от размера экрана
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div>
            <div className="div-wrapper" onTouchMove={handleTouchMove} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ position: "relative", width: "100vw", height: "100vh" }}>
                <div
                    className="div-block"
                    ref={divBlockRef}
                    style={{
                        top: `${position.y}px`,
                        left: `${position.x}px`,
                        position: "absolute",
                    }}
                />
            </div>
        </div>
    );
};

export default TestHomeAnket;
