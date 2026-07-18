import { Canvas } from '@react-three/fiber/native';

import { GameSceneContent } from './GameSceneContent';

interface RingRunnerSceneProps {
  resetToken: number;
}

export function RingRunnerScene({ resetToken }: RingRunnerSceneProps) {
  return (
    <Canvas
      style={{ flex: 1 }}
      camera={{ fov: 55, near: 0.1, far: 120, position: [0, 3.2, 9] }}
      gl={{ antialias: true }}
    >
      <GameSceneContent resetToken={resetToken} />
    </Canvas>
  );
}
