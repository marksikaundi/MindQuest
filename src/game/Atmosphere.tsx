import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Points } from 'three';
import * as THREE from 'three';

import { useGameStore } from './store';
import { BASE_SPEED, MAX_SPEED, SPEED_PER_SCORE } from './types';

const STAR_COUNT = 180;

function speedForScore(score: number): number {
  return Math.min(MAX_SPEED, BASE_SPEED + score * SPEED_PER_SCORE);
}

export function Atmosphere() {
  const pointsRef = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = Math.random() * 10 - 1;
      arr[i * 3 + 2] = -Math.random() * 70 - 2;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) {
      return;
    }

    const { status, score } = useGameStore.getState();
    const speed = status === 'playing' ? speedForScore(score) : BASE_SPEED * 0.35;
    const attr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < STAR_COUNT; i += 1) {
      const zi = i * 3 + 2;
      arr[zi] = (arr[zi] ?? 0) + speed * delta * 0.55;
      if ((arr[zi] ?? 0) > 8) {
        arr[zi] = -70 - Math.random() * 10;
        arr[i * 3] = (Math.random() - 0.5) * 28;
        arr[i * 3 + 1] = Math.random() * 10 - 1;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9fefff"
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}
