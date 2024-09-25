import React, { ReactNode, useEffect } from "react";

interface ScrollManagerProps {
    children: ReactNode;
}

const ScrollManager: React.FC<ScrollManagerProps> = ({ children }) => {
    useEffect(() => {
        function ensureDocumentIsScrollable() {
            const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
            if (!isScrollable) {
                document.documentElement.style.setProperty("height", "calc(100vh + 1px)", "important");
            }
        }

        function preventCollapse() {
            if (window.scrollY === 0) {
                window.scrollTo(0, 1);
            }
        }

        const rootElement = document.getElementById("root"); // Используем #root

        rootElement?.addEventListener("touchstart", preventCollapse);
        window.addEventListener("load", ensureDocumentIsScrollable);

        return () => {
            rootElement?.removeEventListener("touchstart", preventCollapse);
            window.removeEventListener("load", ensureDocumentIsScrollable);
        };
    }, []);

    return <>{children}</>;
};

export default ScrollManager;
