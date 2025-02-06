import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export function CopterModel() {
  const group = useRef<any>(null);
  const { scene, animations } = useGLTF("/assets/copter/scene.gltf");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        action?.play();
      });
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={0.3}
        position={[-0.5, -0.8, 0]}
        rotation={[0.2, -0.4, -0.3]}
      />
    </group>
  );
}