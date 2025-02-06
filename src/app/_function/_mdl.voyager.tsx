import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export function VoyagerModel() {
  const { scene } = useGLTF('/assets/voyager/scene.gltf')
  const ref = useRef<any>(null)
  let time = 0
  const baseY = -35.05

  useFrame((_, delta) => {
    if (!ref.current) return
    time += delta
    ref.current.position.y = baseY + Math.sin(time * 2) * 0.004
    ref.current.rotation.y += delta * 0.1 
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.01}
      position={[-210, baseY, -180.16]}
      rotation={[0.1, Math.PI / 3.8, -1.1]}
    />
  )
}