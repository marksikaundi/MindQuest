import { useFrame } from '@react-three/fiber';
import { useRef, type MutableRefObject } from 'react';
import type { Group } from 'three';

import { useGameStore } from './store';
import { CORRIDOR, SHIP_RADIUS, STEER_SPEED } from './types';

interface ShipProps {
  shipXRef: MutableRefObject<number>;
}

export function Ship({ shipXRef }: ShipProps) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const status = useGameStore.getState().status;
    if (status !== 'playing' || !groupRef.current) {
      return;
    }

    const target = useGameStore.getState().steerTarget;
    const clampedTarget = Math.max(
      -CORRIDOR.halfWidth + SHIP_RADIUS + 0.15,
      Math.min(CORRIDOR.halfWidth - SHIP_RADIUS - 0.15, target),
    );

    const current = shipXRef.current;
    const next =
      current + (clampedTarget - current) * Math.min(1, STEER_SPEED * delta);
    shipXRef.current = next;
    groupRef.current.position.x = next;
    groupRef.current.rotation.z = -(clampedTarget - current) * 0.35;
    groupRef.current.rotation.y = Math.sin(performance.now() * 0.004) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[SHIP_RADIUS, 20, 20]} />
        <meshStandardMaterial
          color="#7dffb3"
          emissive="#1aff8c"
          emissiveIntensity={0.85}
          metalness={0.35}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.35, 10]} />
        <meshStandardMaterial
          color="#39e6ff"
          emissive="#0ad4ff"
          emissiveIntensity={0.6}
        />
      </mesh>
      <pointLight color="#7dffb3" intensity={1.4} distance={5} />
    </group>
  );
}
