import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

import { Atmosphere } from './Atmosphere';
import { Ship } from './Ship';
import { useGameStore } from './store';
import { BASE_SPEED, MAX_SPEED, SPEED_PER_SCORE } from './types';
import { World } from './World';

interface GameSceneContentProps {
  resetToken: number;
}

function speedForScore(score: number): number {
  return Math.min(MAX_SPEED, BASE_SPEED + score * SPEED_PER_SCORE);
}

function CameraRig({ shipXRef }: { shipXRef: MutableRefObject<number> }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0.4, -14));
  const shakeRef = useRef(0);

  useEffect(() => {
    camera.position.set(0, 3.4, 9.2);
    camera.lookAt(0, 0.45, -14);
  }, [camera]);

  useFrame((_, delta) => {
    const status = useGameStore.getState().status;
    const score = useGameStore.getState().score;
    const x = shipXRef.current;
    const speed = status === 'playing' ? speedForScore(score) : BASE_SPEED * 0.4;
    const speedT = (speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);

    const desiredX = x * 0.42;
    camera.position.x += (desiredX - camera.position.x) * Math.min(1, 6 * delta);
    camera.position.y += (3.25 + speedT * 0.35 - camera.position.y) * 0.05;
    camera.position.z += (9.1 - speedT * 0.8 - camera.position.z) * 0.04;

    if (status === 'gameover') {
      shakeRef.current = Math.min(0.35, shakeRef.current + delta * 2);
    } else {
      shakeRef.current *= 0.9;
    }

    const shake = shakeRef.current;
    const sx = (Math.random() - 0.5) * shake;
    const sy = (Math.random() - 0.5) * shake * 0.6;

    lookTarget.current.set(x * 0.22 + sx, 0.4 + sy, -15);
    camera.lookAt(lookTarget.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      const fovTarget = 54 + speedT * 8;
      camera.fov += (fovTarget - camera.fov) * 0.05;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export function GameSceneContent({ resetToken }: GameSceneContentProps) {
  const shipXRef = useRef(0);
  const status = useGameStore((s) => s.status);

  useEffect(() => {
    if (status === 'playing') {
      shipXRef.current = 0;
    }
  }, [status, resetToken]);

  return (
    <>
      <color attach="background" args={['#040c14']} />
      <fog attach="fog" args={['#040c14', 14, 58]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[5, 12, 8]}
        intensity={1.15}
        castShadow
        color="#d7fff2"
      />
      <directionalLight position={[-7, 3, -6]} intensity={0.45} color="#39e6ff" />
      <pointLight position={[0, 4, -10]} intensity={0.55} color="#0affd7" distance={40} />

      <Atmosphere />
      <CameraRig shipXRef={shipXRef} />
      <Ship shipXRef={shipXRef} />
      <World shipXRef={shipXRef} resetToken={resetToken} />
    </>
  );
}
