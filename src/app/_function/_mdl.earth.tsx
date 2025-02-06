"use client"
import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

export function EarthModel() {
  const group = useRef<any>(null);
  const { scene, animations } = useGLTF("/assets/earth/earth.gltf");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      setTimeout(() => {
        Object.values(actions).forEach((action) => {
          action?.play();
        });
      }, 0);
    }
  }, [actions]);

  return (
      <group ref={group}>
        <primitive
          object={scene}
          scale={10}
          position={[-13, 0, -300]}
          castShadow
          receiveShadow
        />
      </group>
  );
}