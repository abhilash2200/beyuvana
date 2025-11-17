"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface CartConfettiProps {
    show: boolean;
    width: number;
}

export function CartConfetti({ show, width }: CartConfettiProps) {
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setHeight(window.innerHeight);
            
            const handleResize = () => {
                setHeight(window.innerHeight);
            };
            
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    if (!show || height === 0) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={150}
                gravity={0.4}
                initialVelocityY={20}
                initialVelocityX={5}
                colors={["#057A37", "#0C4B33", "#1A2819", "#FFD700", "#FF6B6B"]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    );
}

