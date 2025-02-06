"use client"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useRef, useState, useEffect } from 'react'
import { SpacesModel } from './_function/_mdl.space'
import { StationModel } from './_function/_mdl.station'
import { ErrorBoundary } from 'react-error-boundary'
import { LoadingSpinner, ModelErrorFallback } from './_function/_other.misc'
import * as THREE from 'three'
import { EarthModel } from './_function/_mdl.earth'
import { VoyagerModel } from './_function/_mdl.voyager'

interface DebugLocatorProps {
    onCameraUpdate: (info: {
        position: { x: number; y: number; z: number };
        rotation: { x: number; y: number; z: number };
    }) => void;
}

function DebugLocator({ onCameraUpdate }: DebugLocatorProps) {
    const { camera } = useThree()

    useFrame(() => {
        onCameraUpdate({
            position: {
                x: parseFloat(camera.position.x.toFixed(3)),
                y: parseFloat(camera.position.y.toFixed(3)),
                z: parseFloat(camera.position.z.toFixed(3))
            },
            rotation: {
                x: parseFloat((camera.rotation.x * 180 / Math.PI).toFixed(3)),
                y: parseFloat((camera.rotation.y * 180 / Math.PI).toFixed(3)),
                z: parseFloat((camera.rotation.z * 180 / Math.PI).toFixed(3))
            }
        });
    });

    return null;
}

interface CameraInfo {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
}

interface DebugPanelProps {
    cameraInfo: CameraInfo;
    targetInfo: { x: number; y: number; z: number };
    onUpdateCamera: (newValues: CameraInfo) => void;
}

function DebugPanel({ cameraInfo, targetInfo, onUpdateCamera }: DebugPanelProps) {
    const [inputValues, setInputValues] = useState<CameraInfo>({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    });

    const copyCameraToClipboard = () => {
        const text = `position: new THREE.Vector3(${cameraInfo.position.x}, ${cameraInfo.position.y}, ${cameraInfo.position.z}),\nrotation: new THREE.Euler(${cameraInfo.rotation.x * Math.PI / 180}, ${cameraInfo.rotation.y * Math.PI / 180}, ${cameraInfo.rotation.z * Math.PI / 180}),`;
        navigator.clipboard.writeText(text);
    };

    const copyTargetToClipboard = () => {
        const text = `target: new THREE.Vector3(${targetInfo.x}, ${targetInfo.y}, ${targetInfo.z})`;
        navigator.clipboard.writeText(text);
    };

    const handleInputChange = (type: 'position' | 'rotation', axis: 'x' | 'y' | 'z', value: string) => {
        setInputValues(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [axis]: parseFloat(value) || 0
            }
        }));
    };

    const applyValues = () => {
        onUpdateCamera(inputValues);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 10,
            left: 10,
            backgroundColor: 'rgba(0,0,0,0.3)',
            color: 'white',
            padding: 10,
            fontFamily: 'monospace',
            fontSize: 12,
            zIndex: 1000
        }}>
            <div>Current Position:
                x: {cameraInfo.position.x.toFixed(3)}
                y: {cameraInfo.position.y.toFixed(3)}
                z: {cameraInfo.position.z.toFixed(3)}
            </div>
            <div>Current Rotation:
                x: {cameraInfo.rotation.x.toFixed(3)}°
                y: {cameraInfo.rotation.y.toFixed(3)}°
                z: {cameraInfo.rotation.z.toFixed(3)}°
            </div>
            <div>Current Target:
                x: {targetInfo.x.toFixed(3)}
                y: {targetInfo.y.toFixed(3)}
                z: {targetInfo.z.toFixed(3)}
            </div>
            <div style={{ marginTop: 10 }}>
                <div>Set Position:</div>
                <div className='text-black'>
                    x: <input type="number" value={inputValues.position.x}
                        onChange={(e) => handleInputChange('position', 'x', e.target.value)}
                        style={{ width: 60, marginRight: 5 }} />
                    y: <input type="number" value={inputValues.position.y}
                        onChange={(e) => handleInputChange('position', 'y', e.target.value)}
                        style={{ width: 60, marginRight: 5 }} />
                    z: <input type="number" value={inputValues.position.z}
                        onChange={(e) => handleInputChange('position', 'z', e.target.value)}
                        style={{ width: 60 }} />
                </div>
                <div>Set Rotation:</div>
                <div className='text-black'>
                    x: <input type="number" value={inputValues.rotation.x}
                        onChange={(e) => handleInputChange('rotation', 'x', e.target.value)}
                        style={{ width: 60, marginRight: 5 }} />
                    y: <input type="number" value={inputValues.rotation.y}
                        onChange={(e) => handleInputChange('rotation', 'y', e.target.value)}
                        style={{ width: 60, marginRight: 5 }} />
                    z: <input type="number" value={inputValues.rotation.z}
                        onChange={(e) => handleInputChange('rotation', 'z', e.target.value)}
                        style={{ width: 60 }} />
                </div>
                <button onClick={applyValues} style={{ marginTop: 5 }}>Apply</button>
                <button onClick={copyCameraToClipboard} style={{ marginLeft: 5 }}>Copy Camera</button>
                <button onClick={copyTargetToClipboard} style={{ marginLeft: 5 }}>Copy Target</button>
            </div>
        </div>
    );
}

function Scene({
    setDebugInfo,
    controlsRef,
    targetCamera,
    onTargetCameraApplied,
    onTargetUpdate
}: {
    setDebugInfo: (info: CameraInfo) => void;
    controlsRef: any;
    targetCamera: CameraInfo | null;
    onTargetCameraApplied: () => void;
    onTargetUpdate: (target: { x: number; y: number; z: number }) => void;
}) {
    const { camera } = useThree();

    useEffect(() => {
        if (targetCamera) {
            const originalRotationOrder = camera.rotation.order;
            camera.rotation.order = 'YXZ';

            camera.position.set(
                targetCamera.position.x,
                targetCamera.position.y,
                targetCamera.position.z
            );

            const radX = targetCamera.rotation.x * Math.PI / 180;
            const radY = targetCamera.rotation.y * Math.PI / 180;
            const radZ = targetCamera.rotation.z * Math.PI / 180;

            camera.rotation.set(radX, radY, radZ);

            const direction = new THREE.Vector3(0, 0, -1);
            direction.applyEuler(new THREE.Euler(radX, radY, 0, 'YXZ'));

            const newTarget = new THREE.Vector3()
                .copy(camera.position)
                .add(direction.multiplyScalar(100));

            // Update controls and log current target
            controlsRef.current.target.copy(newTarget);
            console.log("Current target:", controlsRef.current.target);
            controlsRef.current.update();

            // Send the updated target to the parent component
            onTargetUpdate({
                x: controlsRef.current.target.x,
                y: controlsRef.current.target.y,
                z: controlsRef.current.target.z,
            });

            camera.rotation.order = originalRotationOrder;
            onTargetCameraApplied();
        }
    }, [targetCamera, camera, controlsRef, onTargetCameraApplied, onTargetUpdate]);

    return (
        <>
            <DebugLocator onCameraUpdate={setDebugInfo} />
            <Environment preset="night" />
            <ambientLight intensity={0.1} />
            <EarthModel />
            <SpacesModel />
            <VoyagerModel />
            <StationModel />
            <OrbitControls
                ref={controlsRef}
                target={[-210, -35, -180]}
            />
            <EffectComposer>
                <Bloom
                    intensity={0.5}
                    luminanceThreshold={0.1}
                    luminanceSmoothing={0.9}
                    kernelSize={3}
                />
            </EffectComposer>
        </>
    );
}

export default function Home() {
    const controlsRef = useRef<any>(null);
    const [debugInfo, setDebugInfo] = useState<CameraInfo>({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 }
    });
    const [targetCamera, setTargetCamera] = useState<CameraInfo | null>(null);
    const [targetInfo, setTargetInfo] = useState<{ x: number; y: number; z: number }>({
        x: -13.5, y: 0, z: -320
    });

    useEffect(() => {
        const controls = controlsRef.current;
        if (controls) {
            const onChange = () => {
                setTargetInfo({
                    x: controls.target.x,
                    y: controls.target.y,
                    z: controls.target.z
                });
            };
            controls.addEventListener("change", onChange);
            return () => controls.removeEventListener("change", onChange);
        }
    }, [controlsRef]);

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1
            }}>
                <Canvas
                    camera={{
                        fov: 45,
                        position: [-2.787, 1.372, -325.042],
                        rotation: [-2.7494520772517075, 1.156978761147041, 2.779628820018689]
                    }}
                >
                    <Suspense fallback={<LoadingSpinner />}>
                        <ErrorBoundary fallback={<ModelErrorFallback />}>
                            <Scene
                                setDebugInfo={setDebugInfo}
                                controlsRef={controlsRef}
                                targetCamera={targetCamera}
                                onTargetCameraApplied={() => setTargetCamera(null)}
                                onTargetUpdate={setTargetInfo}
                            />
                        </ErrorBoundary>
                    </Suspense>
                </Canvas>
            </div>
            <DebugPanel
                cameraInfo={debugInfo}
                targetInfo={targetInfo}
                onUpdateCamera={setTargetCamera}
            />
        </>
    );
}