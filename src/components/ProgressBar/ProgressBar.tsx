import React from "react";

interface ProgressBarProps {
    lines: number;
    fill: number;
}

export default function ProgressBar({ lines, fill }: ProgressBarProps) {
    const allLines = Array.from({ length: lines }, (_, index) => <div key={index} className={`progress-bar__line ${index < fill ? "active" : ""}`}></div>);

    return (
        <div className="progress-bar">
            <div className="progress-bar__wrapper">{allLines}</div>
        </div>
    );
}
