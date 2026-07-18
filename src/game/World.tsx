import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';
import type { Group, Mesh } from 'three';

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

export function World({ shipXRef, resetToken }: WorldProps) {
  const [entities, setEntities] = useState<WorldEntity[]>(() => initialEntities());
  const entitiesRef = useRef(entities);
  const groupRefs = useRef<Map<number, Group>>(new Map());
  const wallLeft = useRef<Mesh>(null);
  const wallRight = useRef<Mesh>(null);

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
          group.rotation.z += delta * 1.2;
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
          if (entity.kind === 'obstacle') {
            const mesh = group.children[0] as Mesh | undefined;
            if (mesh) {
              mesh.scale.set(1, 1, 1);
            }
          }
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
  });

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, -20]}
        receiveShadow
      >
        <planeGeometry args={[CORRIDOR.halfWidth * 2.4, 90]} />
        <meshStandardMaterial color="#0a1620" roughness={0.95} metalness={0.05} />
      </mesh>

      <mesh
        ref={wallLeft}
        position={[-CORRIDOR.halfWidth, CORRIDOR.wallHeight / 2, -20]}
      >
        <boxGeometry args={[0.12, CORRIDOR.wallHeight, CORRIDOR.wallLength]} />
        <meshStandardMaterial
          color="#0d2a33"
          emissive="#0affd7"
          emissiveIntensity={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh
        ref={wallRight}
        position={[CORRIDOR.halfWidth, CORRIDOR.wallHeight / 2, -20]}
      >
        <boxGeometry args={[0.12, CORRIDOR.wallHeight, CORRIDOR.wallLength]} />
        <meshStandardMaterial
          color="#0d2a33"
          emissive="#0affd7"
          emissiveIntensity={0.15}
          transparent
          opacity={0.85}
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
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[entity.radius, RING_TUBE, 12, 36]} />
              <meshStandardMaterial
                color="#39e6ff"
                emissive="#17c8ff"
                emissiveIntensity={1.1}
                metalness={0.4}
                roughness={0.2}
              />
            </mesh>
          ) : (
            <mesh castShadow>
              <boxGeometry
                args={[
                  entity.size.x * 2,
                  entity.size.y * 2,
                  entity.size.z * 2,
                ]}
              />
              <meshStandardMaterial
                color="#ff4d6d"
                emissive="#ff1744"
                emissiveIntensity={0.55}
                metalness={0.2}
                roughness={0.4}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
