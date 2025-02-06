'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useAnimations, useGLTF, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export function CameraController() {
    const controlsRef = useRef<any>(null)
    const lastLogTime = useRef(0)

    // Define waypoints for camera animation
    const waypoints = [
        {
            position: new THREE.Vector3(-6.955, 1.034, -315.078),
            target: new THREE.Vector3(-10, 0, -320),
            rotation: new THREE.Euler(-0.18750072154175082, 0.745726829499617, 0.12803735392630403),
            scrollPercentage: 0
        },
        {
            position: new THREE.Vector3(-3.161, 0.883, -328.776),
            target: new THREE.Vector3(-11, -1, -320),
            rotation: new THREE.Euler(-0.18750072154175082, 0.745726829499617, 0.12803735392630403),
            scrollPercentage: 33
        },
        {
            position: new THREE.Vector3(-2.787, 1.372, -325.042),
            target: new THREE.Vector3(-13.5, -1.5, -322),
            rotation: new THREE.Euler(-2.7494520772517075, 1.156978761147041, 2.779628820018689),
            scrollPercentage: 70
        },
        {
            position: new THREE.Vector3(-209.46, -34.905, -180.378),
            target: new THREE.Vector3(-210, -35, -180),
            rotation: new THREE.Euler(-2.895885201494031, 0.9456892019006075, 2.9409845093655647),
            scrollPercentage: 99
        }
    ]

    const currentPosition = useRef(waypoints[0].position.clone())
    const currentTarget = useRef(waypoints[0].target.clone())
    const currentRotation = useRef(waypoints[0].rotation.clone())

    useEffect(() => {
        const updatePageHeight = () => {
            const pageHeight = window.innerHeight * (waypoints.length - 1)
            document.documentElement.style.height = `${pageHeight}px`
        }
        updatePageHeight()
        window.addEventListener('resize', updatePageHeight)

        const handleScroll = () => {
            const scrollTop = window.scrollY
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight
            let scrollPercentage = (scrollTop / maxScroll) * 100
            scrollPercentage = Math.min(100, Math.max(0, scrollPercentage))

            if (scrollPercentage >= waypoints[waypoints.length - 1].scrollPercentage) {
                currentPosition.current.copy(waypoints[waypoints.length - 1].position)
                currentTarget.current.copy(waypoints[waypoints.length - 1].target)
                currentRotation.current.copy(waypoints[waypoints.length - 1].rotation)
                return
            }

            let currentIndex = 0
            for (let i = 0; i < waypoints.length - 1; i++) {
                if (
                    scrollPercentage >= waypoints[i].scrollPercentage &&
                    scrollPercentage < waypoints[i + 1].scrollPercentage
                ) {
                    currentIndex = i
                    break
                }
            }

            const current = waypoints[currentIndex]
            const next = waypoints[currentIndex + 1]

            let localPercentage =
                (scrollPercentage - current.scrollPercentage) /
                (next.scrollPercentage - current.scrollPercentage)
            localPercentage = Math.min(1, Math.max(0, localPercentage))

            currentPosition.current.lerpVectors(current.position, next.position, localPercentage)
            currentTarget.current.lerpVectors(current.target, next.target, localPercentage)

            const currentQuat = new THREE.Quaternion().setFromEuler(current.rotation)
            const nextQuat = new THREE.Quaternion().setFromEuler(next.rotation)
            const resultQuat = new THREE.Quaternion()
            resultQuat.slerpQuaternions(currentQuat, nextQuat, localPercentage)
            currentRotation.current.setFromQuaternion(resultQuat)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', updatePageHeight)
        }
    }, [])

    useFrame(({ camera }) => {
        camera.position.copy(currentPosition.current)
        camera.lookAt(currentTarget.current)

        if (controlsRef.current) {
            controlsRef.current.target.copy(currentTarget.current)
            controlsRef.current.update()
        }

        // const now = Date.now()
        // if (now - lastLogTime.current > 1000) { 
        //     console.log('Camera Debug Info:', {
        //         position: {
        //             x: camera.position.x.toFixed(3),
        //             y: camera.position.y.toFixed(3),
        //             z: camera.position.z.toFixed(3)
        //         },
        //         rotation: {
        //             x: (camera.rotation.x * 180 / Math.PI).toFixed(3) + '°',
        //             y: (camera.rotation.y * 180 / Math.PI).toFixed(3) + '°',
        //             z: (camera.rotation.z * 180 / Math.PI).toFixed(3) + '°'
        //         },
        //         target: {
        //             x: controlsRef.current?.target.x.toFixed(3),
        //             y: controlsRef.current?.target.y.toFixed(3),
        //             z: controlsRef.current?.target.z.toFixed(3)
        //         },
        //         scrollY: window.scrollY
        //     })
        //     lastLogTime.current = now
        // }
    })

    return <OrbitControls
        enablePan={false}
        zoomSpeed={0.5}
        enableZoom={false}
        ref={controlsRef}
        target={currentTarget.current}
    />
}