"use client";
import { Html } from '@react-three/drei' 

export function LoadingSpinner() {
    return (
        <Html center>
            <div>Loading...</div>
        </Html>
    )
}

export function ModelErrorFallback() {
    return (
        <Html center>
            <div style={{ color: 'red' }}>Error loading model</div>
        </Html>
    )
}