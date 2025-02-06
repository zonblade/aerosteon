"use client"
import { useState } from "react";
import "./glow.css"

export function CE_Contact() {
    const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

    return (
        <div className="flex flex-1 w-full flex-col items-center justify-center h-full bg-gradient-to-b from-transparent to-sky-700/30">
            <div className="items-start justify-center pt-[10vh]">
                <span className="font-use-airbeat text-3xl">Get Your Journey!</span>
            </div>
            <div className="flex-1 w-full flex justify-center items-center pt-4">
                <div className="w-full max-w-[800px] min-h-[300px] flex flex-col items-start justify-center p-4 ">
                    <div className="w-full max-w-[300px]">
                        <p className="text-justify">
                            Our expert pilots are ready to guide you safely through hyperspace, 
                            unlocking new worlds and endless possibilities. 
                            Don&apos;t miss your chance to explore the cosmos—contact us today and be part of the future of interstellar travel!
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-end justify-center relative">
                <div
                    className="p-3 flex justify-center items-center rounded-xl absolute bottom-[10vh] bg-white/10 w-full max-w-[350px] h-[48px] backdrop-blur glow"
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }}
                    onMouseLeave={() => setGlowPos({ x: -100, y: -100 })}
                    style={{ '--x': `${glowPos.x}px`, '--y': `${glowPos.y}px` } as React.CSSProperties}
                >
                    <span className="text-center text-white text-lg">
                        <a href="https://github.com/zonblade">Github @ Zonblade</a>
                    </span>
                </div>
            </div>
        </div>
    )
}