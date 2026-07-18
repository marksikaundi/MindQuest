import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type MutableRefObject } from 'react';

import { Ship } from './Ship';
import { useGameStore } from './store';
import { World } from './World';

interface GameSceneContentProps {
  resetToken: number;
}

function CameraRig({ shipXRef }: { shipXRef: MutableRefObject<number> }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 3.2, 9);
    camera.lookAt(0, 0.4, -12);
  }, [camera]);

  useFrame(() => {
    const x = shipXRef.current;
    camera.position.x += (x * 0.45 - camera.position.x) * 0.08;
    camera.lookAt(x * 0.2, 0.35, -14);
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
      <color attach="background" args={['#061018']} />
      <fog attach="fog" args={['#061018', 12, 55]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 10, 6]}
        intensity={1.1}
        castShadow
        color="#d7fff2"
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#39e6ff" />

      <CameraRig shipXRef={shipXRef} />
      <Ship shipXRef={shipXRef} />
      <World shipXRef={shipXRef} resetToken={resetToken} />
    </>
  );
}
