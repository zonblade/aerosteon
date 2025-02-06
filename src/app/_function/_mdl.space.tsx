'use client'
import { useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ErrorBoundary } from 'react-error-boundary'
import * as THREE from 'three'
import { LoadingSpinner, ModelErrorFallback } from './_other.misc'

export function SpacesModel() {
    const { scene } = useGLTF('/assets/spaces/scene.gltf')
    const modelLoaded = useRef(false)
    const modelRef = useRef<any>(null)

    useFrame((_, delta) => {
        if (modelRef.current) {
            modelRef.current.rotation.y -= delta * 0.0003 
        }
    })

    useEffect(() => {
        if (scene) {
            modelLoaded.current = true
        }
    }, [scene])

    useEffect(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.beginPath()
            ctx.arc(16, 16, 14, 0, Math.PI * 2)
            ctx.fillStyle = '#ffffff'
            ctx.fill()
        }
        const circleTexture = new THREE.CanvasTexture(canvas)

        const box = new THREE.Box3().setFromObject(scene)

        const starTypes = [
            { color: 0x99FFFF, intensity: 1.2+3.0 },
            { color: 0x99FFFF, intensity: 1.2+3.0 },
            { color: 0x99FFFF, intensity: 1.2+3.0 },
            { color: 0x99FFFF, intensity: 1.2+3.0 },
            { color: 0x99FFFF, intensity: 1.2+3.0 },
            { color: 0x99FFFF, intensity: 1.2+3.0 },
            { color: 0x99FFFF, intensity: 1.2+3.0 },
            { color: 0xFFA500, intensity: 1.5+3.0 },
            { color: 0xFFA500, intensity: 1.5+3.0 },
            { color: 0xFFA500, intensity: 1.5+3.0 },
            { color: 0xFFA500, intensity: 1.5+3.0 },
            { color: 0xFF3333, intensity: 1.3+3.0 },
            { color: 0xFF3333, intensity: 1.3+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
            { color: 0xFFFFFF, intensity: 2.0+3.0 },
        ]

        scene.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Points) {
                const positions = child.geometry.attributes.position;
                const colors = new Float32Array(positions.count * 3);

                for (let i = 0; i < positions.count; i++) {
                    const starType = starTypes[Math.floor(Math.random() * starTypes.length)]
                    const color = new THREE.Color(starType.color)
                    colors[i * 3] = color.r
                    colors[i * 3 + 1] = color.g
                    colors[i * 3 + 2] = color.b
                }

                child.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

                child.material = new THREE.PointsMaterial({
                    size: 0.1432,
                    sizeAttenuation: true,
                    transparent: true,
                    opacity: 1,
                    map: circleTexture,
                    alphaTest: 0.5,
                    depthWrite: false,
                    vertexColors: true,
                    toneMapped: false
                })
            }
        })
    }, [scene])

    return (
        <ErrorBoundary fallback={<ModelErrorFallback />}>
            <Suspense fallback={<LoadingSpinner />}>
                <primitive
                    ref={modelRef}
                    object={scene}
                    position={[-10, -150, 60]}
                    rotation={[-0.1, Math.PI / 2.4, 0]}
                    scale={100} />
            </Suspense>
        </ErrorBoundary>
    )
}