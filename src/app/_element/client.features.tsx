"use client"

import React, { useRef, useEffect, useState, JSX } from "react"
import { motion, useAnimation, useMotionValue } from "framer-motion"
import "./glow.css"

export function CE_Features() {
    const cardData = [
        {
            title: "Quantum Slipstream Navigation",
            description: "Ultra-fast FTL travel with precise course correction for safe interstellar jumps.",
            element: <div>Feature 1</div>
        },
        {
            title: "Tachyon Acceleration Matrix",
            description: "Uses tachyon bursts to bypass light-speed limits, reducing travel time drastically.",
            element: <div>Feature 2</div>
        },
        {
            title: "Adaptive Reality Shielding",
            description: "Protects against hyperspace anomalies, preventing distortions and time loops.",
            element: <div>Feature 3</div>
        },
        {
            title: "Gravity Well Bypass",
            description: "Allows safe entry and exit from hyperspace near black holes and strong gravity fields.",
            element: <div>Feature 4</div>
        },
        {
            title: "Chrono-Phase Synchronization",
            description: "Prevents time dilation, keeping travelers in sync with real-time events.",
            element: <div>Feature 5</div>
        },
        {
            title: "Multiversal Drift Drive",
            description: "Phases through alternate dimensions to avoid obstacles and explore parallel worlds.",
            element: <div>Feature 6</div>
        }
    ]

    const slides = [...cardData, ...cardData, ...cardData]

    const sliderRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const controls = useAnimation()
    const [cardWidth, setCardWidth] = useState(0)

    const resumeAnimation = () => {
        const cycle = cardData.length * cardWidth;
        const currentX = x.get();
        const normalizedX = ((currentX + cycle) % cycle) - cycle;
        x.set(normalizedX);
        controls.start({
            x: normalizedX - cycle,
            transition: {
                duration: 20,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
            }
        });
    };

    useEffect(() => {
        if (sliderRef.current) {
            const width = sliderRef.current.offsetWidth / 4 
            setCardWidth(width)
            x.set(-cardData.length * width)
            resumeAnimation()
        }
    }, [sliderRef, cardData.length, x, cardWidth])

    const handleDragEnd = () => {
        const currentX = x.get()
        if (cardWidth === 0) return

        const snapStep = cardWidth * 4
        const snapPoint = Math.round(currentX / snapStep) * snapStep

        const cycle = cardData.length * cardWidth;
        const minX = -2 * cycle
        const maxX = -cycle

        if (snapPoint > maxX) {
            x.set(minX + (snapPoint - maxX))
        } else if (snapPoint < minX) {
            x.set(maxX - (minX - snapPoint))
        } else {
            x.set(snapPoint)
        }
    }

    return (
        <div className="flex flex-col flex-1 w-full h-full">
            <div className="flex-1 flex items-start justify-center pt-[7vh]">
                <span className="font-use-airbeat text-3xl">Hyperspace Features</span>
            </div>
            <div className="flex-1">
                <div className="flex flex-1 justify-center items-end pb-[7vh]">
                    <div ref={sliderRef} className="overflow-hidden">
                        <motion.div
                            style={{ x }}
                            animate={controls}
                            drag="x"
                            dragConstraints={{ left: -Infinity, right: Infinity }}
                            onDragStart={() => controls.stop()}
                            onDragEnd={() => {
                                handleDragEnd()
                                resumeAnimation()
                            }}
                            className="flex"
                        >
                            {slides.map((card, index) => (
                                <div key={index} style={{ minWidth: cardWidth }} className="p-4">
                                    <CardDex title={card.title} description={card.description} element={card.element} />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CardDex({ title, description, element }: { title: string, description: string, element: JSX.Element }) {
    const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
    return (
        <div
            className="w-full min-h-[250px] m-6 bg-white/10 backdrop-blur-md rounded-xl p-4 flex flex-col items-center justify-center glow"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseLeave={() => setGlowPos({ x: -100, y: -100 })}
            style={{ '--x': `${glowPos.x}px`, '--y': `${glowPos.y}px` } as React.CSSProperties}
        >
            <div className="flex flex-1">
                {element}
            </div>
            <div className="flex flex-1">
                <h3 className="font-use-airbeat text-center">{title}</h3>
            </div>
            <div className="flex flex-1">
                <p className="text-justify">{description}</p>
            </div>
        </div>
    )
}