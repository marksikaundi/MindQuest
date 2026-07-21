import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type MutableRefObject } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';

import { useGameStore } from './store';
import {
  CORRIDOR,
  KEYBOARD_STEER_RATE,
  SHIP_RADIUS,
  STEER_MAX_LATERAL,
  STEER_RESPONSIVENESS,
} from './types';

interface ShipProps {
  shipXRef: MutableRefObject<number>;
}

const TRAIL_COUNT = 14;

export function Ship({ shipXRef }: ShipProps) {
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const trailRefs = useRef<(Mesh | null)[]>([]);
  const velocityRef = useRef(0);
  const trailOffsets = useMemo(
    () => Array.from({ length: TRAIL_COUNT }, (_, i) => (i + 1) * 0.18),
    [],
  );

  useFrame((_, delta) => {
    const status = useGameStore.getState().status;
    if (!groupRef.current) {
      return;
    }

    if (status !== 'playing') {
      groupRef.current.rotation.z *= 0.9;
      return;
    }

    const state = useGameStore.getState();
    const limit = CORRIDOR.halfWidth - SHIP_RADIUS - 0.2;
    let target = state.steerTarget;

    if (state.steerAxis !== 0) {
      target += state.steerAxis * KEYBOARD_STEER_RATE * delta;
      target = Math.max(-limit, Math.min(limit, target));
      useGameStore.setState({ steerTarget: target });
    }

    const clampedTarget = Math.max(-limit, Math.min(limit, target));
    const current = shipXRef.current;
    const error = clampedTarget - current;
    const desiredVel = error * STEER_RESPONSIVENESS;
    const maxStep = STEER_MAX_LATERAL;
    const vel = Math.max(-maxStep, Math.min(maxStep, desiredVel));
    const next = current + vel * delta;
    const clampedNext = Math.max(-limit, Math.min(limit, next));

    velocityRef.current = (clampedNext - current) / Math.max(delta, 1e-4);
    shipXRef.current = clampedNext;

    const bank = THREE.MathUtils.clamp(-velocityRef.current * 0.045, -0.55, 0.55);
    const pitch = Math.sin(performance.now() * 0.006) * 0.04;
    const bob = Math.sin(performance.now() * 0.008) * 0.03;

    groupRef.current.position.x = clampedNext;
    groupRef.current.position.y = bob;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      bank,
      Math.min(1, 12 * delta),
    );
    groupRef.current.rotation.x = pitch;
    groupRef.current.rotation.y = -velocityRef.current * 0.012;

    if (glowRef.current) {
      const pulse = 0.7 + Math.sin(performance.now() * 0.02) * 0.25;
      glowRef.current.scale.setScalar(pulse);
    }

    const speedFactor = Math.min(1.4, 0.7 + Math.abs(velocityRef.current) * 0.04);
    for (let i = 0; i < TRAIL_COUNT; i += 1) {
      const mesh = trailRefs.current[i];
      if (!mesh) {
        continue;
      }
      const t = (i + 1) / TRAIL_COUNT;
      const sway = Math.sin(performance.now() * 0.012 + i * 0.4) * 0.04 * t;
      mesh.position.set(
        clampedNext + sway - bank * t * 0.35,
        bob - 0.02,
        trailOffsets[i] ?? 0.2,
      );
      const scale = (1 - t) * 0.55 * speedFactor;
      mesh.scale.setScalar(Math.max(0.08, scale));
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = (1 - t) * 0.55;
    }
  });

  return (
    <group>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Fuselage */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.22, 0.85, 6]} />
          <meshStandardMaterial
            color="#b8ffe0"
            emissive="#2bff9a"
            emissiveIntensity={0.55}
            metalness={0.55}
            roughness={0.22}
          />
        </mesh>
        {/* Nose tip */}
        <mesh position={[0, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.08, 0.28, 5]} />
          <meshStandardMaterial
            color="#7ef0ff"
            emissive="#19d7ff"
            emissiveIntensity={0.9}
            metalness={0.4}
            roughness={0.18}
          />
        </mesh>
        {/* Wings */}
        <mesh position={[0, -0.02, 0.08]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.95, 0.04, 0.28]} />
          <meshStandardMaterial
            color="#1a3d42"
            emissive="#0affd7"
            emissiveIntensity={0.35}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Wing tips */}
        <mesh position={[-0.48, 0.02, 0.05]}>
          <boxGeometry args={[0.08, 0.16, 0.12]} />
          <meshStandardMaterial
            color="#39e6ff"
            emissive="#39e6ff"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0.48, 0.02, 0.05]}>
          <boxGeometry args={[0.08, 0.16, 0.12]} />
          <meshStandardMaterial
            color="#39e6ff"
            emissive="#39e6ff"
            emissiveIntensity={0.8}
          />
        </mesh>
        {/* Cockpit */}
        <mesh position={[0, 0.1, -0.08]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color="#e8fffb"
            emissive="#7dffb3"
            emissiveIntensity={0.4}
            metalness={0.2}
            roughness={0.1}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Engine core */}
        <mesh ref={glowRef} position={[0, 0, 0.42]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#7dffb3"
            emissiveIntensity={2.2}
            transparent
            opacity={0.95}
          />
        </mesh>
        <pointLight color="#7dffb3" intensity={2.2} distance={7} decay={2} />
        <pointLight
          color="#39e6ff"
          intensity={0.9}
          distance={4}
          decay={2}
          position={[0, 0.2, -0.2]}
        />
      </group>

      {trailOffsets.map((z, i) => (
        <mesh
          key={`trail-${z}`}
          ref={(node) => {
            trailRefs.current[i] = node;
          }}
          position={[0, 0, z]}
        >
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial
            color="#7dffb3"
            emissive="#2bff9a"
            emissiveIntensity={1.4}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
