"use client"
import { Canvas } from '@react-three/fiber'
import { CopterModel } from '../_function/_mdl.copter'
import { OrbitControls } from '@react-three/drei'
import "./glow-green.css"
import { useState } from 'react'

export function CE_About() {
    const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

    return (
        <div className="flex flex-1 justify-center items-start">
            <div className="h-full w-full flex flex-col md:flex-row max-w-[900px] pt-[5vh]">
                <div className='flex-1'>

                </div>
                <div className='flex-1 flex flex-col items-center justify-start relative p-4'>
                    <div className='absolute top-0 left-0 w-full flex justify-center items-start h-full z-30 pointer-events-none'>
                        <Canvas
                            className="max-h-[210px] max-w-[310px]"
                            dpr={[0.5, 1]}  // Lower device pixel ratio for lower GPU usage
                            gl={{ antialias: true, powerPreference: 'high-performance' }}
                            camera={{
                                fov: 45,
                                near: 0.1,
                                far: 50,
                            }}
                        >
                            <CopterModel />
                            <pointLight position={[0.4, 0.7, 0.8]} intensity={5} />
                            <pointLight position={[-2.1, -0.9, 0.8]} intensity={5} />
                            <OrbitControls
                                enableZoom={false}
                                enableDamping={false}
                                enablePan={false}
                                enableRotate={true}
                                minPolarAngle={Math.PI / 2}
                                maxPolarAngle={Math.PI / 2}
                            />
                        </Canvas>
                    </div>
                    <div
                        className='mt-[100px] min-h-[200px] w-full rounded-xl bg-white/10 p-4 backdrop-blur-sm glow-green'
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                        }}
                        onMouseLeave={() => setGlowPos({ x: -100, y: -100 })}
                        style={{ '--x': `${glowPos.x}px`, '--y': `${glowPos.y}px` } as React.CSSProperties}
                    >
                        <div className='h-[100px]'></div>
                        <div className='flex justify-center items-center'>
                            <span className="font-use-airbeat text-3xl text-center mb-6 w-full">
                                A E R O L O N
                            </span>
                        </div>
                        <p className='text-justify'>Join us on a journey beyond the stars, where hyperspace technology unlocks limitless exploration at faster-than-light speeds. With Quantum Slipstream Navigation and Tachyon Acceleration, we make deep-space travel safe, seamless, and thrilling. Discover new worlds, forge interstellar connections, and experience the future of humanity firsthand. Our advanced systems ensure time synchronization, so you stay connected while venturing into the unknown. The universe is calling—will you take the leap into hyperspace? 🚀✨</p>
                    </div>
                </div>
            </div>
        </div>
    )
}