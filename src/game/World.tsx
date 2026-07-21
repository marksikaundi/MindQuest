import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';

import { passesRing, shipCollides } from './systems/collision';
import {
  farthestEntityZ,
  initialEntities,
  recycleEntity,
} from './systems/spawn';
import { useGameStore } from './store';
import {
  BASE_SPEED,
  CORRIDOR,
  MAX_SPEED,
  RECYCLE_Z,
  RING_TUBE,
  SPEED_PER_SCORE,
  type WorldEntity,
} from './types';

interface WorldProps {
  shipXRef: MutableRefObject<number>;
  resetToken: number;
}

function speedForScore(score: number): number {
  return Math.min(MAX_SPEED, BASE_SPEED + score * SPEED_PER_SCORE);
}

function FloorStripes() {
  const stripes = useMemo(() => {
    const items: { z: number; key: string }[] = [];
    for (let i = 0; i < 28; i += 1) {
      items.push({ z: -i * 3.2, key: `stripe-${i}` });
    }
    return items;
  }, []);

  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }
    const { status, score } = useGameStore.getState();
    const speed = status === 'playing' ? speedForScore(score) : BASE_SPEED * 0.25;
    const scroll = (performance.now() * 0.001 * speed) % 3.2;
    groupRef.current.position.z = scroll;
  });

  return (
    <group ref={groupRef}>
      {stripes.map((stripe) => (
        <mesh
          key={stripe.key}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, stripe.z]}
        >
          <planeGeometry args={[0.18, 1.6]} />
          <meshStandardMaterial
            color="#0affd7"
            emissive="#0affd7"
            emissiveIntensity={0.65}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function WallRibs({ side }: { side: 'left' | 'right' }) {
  const x = side === 'left' ? -CORRIDOR.halfWidth : CORRIDOR.halfWidth;
  const ribs = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      z: -i * 4,
      key: `${side}-rib-${i}`,
    }));
  }, [side]);
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }
    const { status, score } = useGameStore.getState();
    const speed = status === 'playing' ? speedForScore(score) : BASE_SPEED * 0.25;
    const scroll = (performance.now() * 0.001 * speed) % 4;
    groupRef.current.position.z = scroll;
  });

  return (
    <group ref={groupRef}>
      {ribs.map((rib) => (
        <mesh key={rib.key} position={[x, CORRIDOR.wallHeight * 0.45, rib.z]}>
          <boxGeometry args={[0.18, CORRIDOR.wallHeight * 0.9, 0.12]} />
          <meshStandardMaterial
            color="#10343c"
            emissive="#0affd7"
            emissiveIntensity={0.28}
            metalness={0.4}
            roughness={0.45}
          />
        </mesh>
      ))}
    </group>
  );
}

export function World({ shipXRef, resetToken }: WorldProps) {
  const [entities, setEntities] = useState<WorldEntity[]>(() => initialEntities());
  const entitiesRef = useRef(entities);
  const groupRefs = useRef<Map<number, Group>>(new Map());
  const wallLeft = useRef<Mesh>(null);
  const wallRight = useRef<Mesh>(null);
  const railLeft = useRef<Mesh>(null);
  const railRight = useRef<Mesh>(null);

  useLayoutEffect(() => {
    const next = initialEntities();
    entitiesRef.current = next;
    setEntities(next);
    groupRefs.current.clear();
  }, [resetToken]);

  useFrame((_, delta) => {
    const { status, score, addScore, endGame } = useGameStore.getState();
    if (status !== 'playing') {
      return;
    }

    const speed = speedForScore(score);
    const list = entitiesRef.current;
    const shipX = shipXRef.current;
    const shipZ = 0;

    for (const entity of list) {
      entity.position.z += speed * delta;

      const group = groupRefs.current.get(entity.id);
      if (group) {
        group.position.set(entity.position.x, entity.position.y, entity.position.z);
        if (entity.kind === 'ring') {
          group.rotation.z += delta * 1.6;
          const pulse = 1 + Math.sin(performance.now() * 0.008 + entity.id) * 0.04;
          group.scale.setScalar(pulse);
        } else {
          group.rotation.y += delta * 1.1;
          group.rotation.x += delta * 0.45;
        }
      }

      if (passesRing(shipX, shipZ, entity)) {
        entity.scored = true;
        addScore(1);
      }
    }

    if (shipCollides(shipX, shipZ, list)) {
      endGame();
      return;
    }

    for (const entity of list) {
      if (entity.position.z > RECYCLE_Z) {
        const far = farthestEntityZ(list);
        recycleEntity(entity, far, score);
        const group = groupRefs.current.get(entity.id);
        if (group) {
          group.position.set(entity.position.x, entity.position.y, entity.position.z);
          group.scale.set(1, 1, 1);
          group.rotation.set(0, 0, 0);
        }
      }
    }

    const scroll = (performance.now() * 0.001 * speed) % 4;
    if (wallLeft.current) {
      wallLeft.current.position.z = -scroll;
    }
    if (wallRight.current) {
      wallRight.current.position.z = -scroll;
    }
    if (railLeft.current) {
      railLeft.current.position.z = -scroll * 0.5;
    }
    if (railRight.current) {
      railRight.current.position.z = -scroll * 0.5;
    }
  });

  return (
    <group>
      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -22]} receiveShadow>
        <planeGeometry args={[CORRIDOR.halfWidth * 2.6, 100]} />
        <meshStandardMaterial
          color="#07131c"
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>

      {/* Floor edge glows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-CORRIDOR.halfWidth + 0.08, 0.02, -22]}>
        <planeGeometry args={[0.1, 100]} />
        <meshStandardMaterial
          color="#0affd7"
          emissive="#0affd7"
          emissiveIntensity={0.9}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CORRIDOR.halfWidth - 0.08, 0.02, -22]}>
        <planeGeometry args={[0.1, 100]} />
        <meshStandardMaterial
          color="#0affd7"
          emissive="#0affd7"
          emissiveIntensity={0.9}
          transparent
          opacity={0.7}
        />
      </mesh>

      <FloorStripes />

      {/* Side walls */}
      <mesh
        ref={wallLeft}
        position={[-CORRIDOR.halfWidth, CORRIDOR.wallHeight / 2, -22]}
      >
        <boxGeometry args={[0.1, CORRIDOR.wallHeight, CORRIDOR.wallLength]} />
        <meshStandardMaterial
          color="#0a222b"
          emissive="#087a6a"
          emissiveIntensity={0.22}
          transparent
          opacity={0.88}
          metalness={0.35}
          roughness={0.4}
        />
      </mesh>
      <mesh
        ref={wallRight}
        position={[CORRIDOR.halfWidth, CORRIDOR.wallHeight / 2, -22]}
      >
        <boxGeometry args={[0.1, CORRIDOR.wallHeight, CORRIDOR.wallLength]} />
        <meshStandardMaterial
          color="#0a222b"
          emissive="#087a6a"
          emissiveIntensity={0.22}
          transparent
          opacity={0.88}
          metalness={0.35}
          roughness={0.4}
        />
      </mesh>

      <WallRibs side="left" />
      <WallRibs side="right" />

      {/* Top rails */}
      <mesh
        ref={railLeft}
        position={[-CORRIDOR.halfWidth * 0.92, CORRIDOR.wallHeight - 0.1, -22]}
      >
        <boxGeometry args={[0.08, 0.08, CORRIDOR.wallLength]} />
        <meshStandardMaterial
          color="#39e6ff"
          emissive="#39e6ff"
          emissiveIntensity={0.75}
        />
      </mesh>
      <mesh
        ref={railRight}
        position={[CORRIDOR.halfWidth * 0.92, CORRIDOR.wallHeight - 0.1, -22]}
      >
        <boxGeometry args={[0.08, 0.08, CORRIDOR.wallLength]} />
        <meshStandardMaterial
          color="#39e6ff"
          emissive="#39e6ff"
          emissiveIntensity={0.75}
        />
      </mesh>

      {/* Horizon glow */}
      <mesh position={[0, 1.2, -48]}>
        <planeGeometry args={[18, 6]} />
        <meshBasicMaterial
          color="#0affd7"
          transparent
          opacity={0.08}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {entities.map((entity) => (
        <group
          key={entity.id}
          ref={(node) => {
            if (node) {
              groupRefs.current.set(entity.id, node);
              node.position.set(
                entity.position.x,
                entity.position.y,
                entity.position.z,
              );
            } else {
              groupRefs.current.delete(entity.id);
            }
          }}
        >
          {entity.kind === 'ring' ? (
            <>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[entity.radius, RING_TUBE, 14, 48]} />
                <meshStandardMaterial
                  color="#7ef0ff"
                  emissive="#17c8ff"
                  emissiveIntensity={1.35}
                  metalness={0.45}
                  roughness={0.18}
                />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry
                  args={[entity.radius * 0.72, RING_TUBE * 0.45, 10, 32]}
                />
                <meshStandardMaterial
                  color="#0affd7"
                  emissive="#0affd7"
                  emissiveIntensity={0.9}
                  transparent
                  opacity={0.55}
                />
              </mesh>
              <pointLight
                color="#39e6ff"
                intensity={1.1}
                distance={4.5}
                decay={2}
              />
            </>
          ) : (
            <>
              <mesh castShadow>
                <octahedronGeometry
                  args={[Math.max(entity.size.x, entity.size.y) * 1.15, 0]}
                />
                <meshStandardMaterial
                  color="#ff4d6d"
                  emissive="#ff1744"
                  emissiveIntensity={0.7}
                  metalness={0.35}
                  roughness={0.28}
                />
              </mesh>
              <mesh scale={[1.35, 1.35, 1.35]}>
                <octahedronGeometry
                  args={[Math.max(entity.size.x, entity.size.y) * 1.15, 0]}
                />
                <meshStandardMaterial
                  color="#ff8aa0"
                  emissive="#ff4d6d"
                  emissiveIntensity={0.35}
                  transparent
                  opacity={0.22}
                  depthWrite={false}
                />
              </mesh>
              <pointLight
                color="#ff4d6d"
                intensity={0.85}
                distance={3.5}
                decay={2}
              />
            </>
          )}
        </group>
      ))}
    </group>
  );
}
