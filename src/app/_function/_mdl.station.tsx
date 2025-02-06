import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

export function StationModel() {
  const group = useRef<any>(null);
  const { scene, animations } = useGLTF("/assets/station/scene.gltf");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        action?.play();
      });
    }
  }, [actions]);

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={0.4}
        position={[-10, 0, -320]}
      />
    </group>
  );
}