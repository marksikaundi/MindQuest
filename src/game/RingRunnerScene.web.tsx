import { Canvas } from '@react-three/fiber';

import { GameSceneContent } from './GameSceneContent';

interface RingRunnerSceneProps {
  resetToken: number;
}

export function RingRunnerScene({ resetToken }: RingRunnerSceneProps) {
  return (
    <Canvas
      style={{ flex: 1, width: '100%', height: '100%' }}
      camera={{ fov: 55, near: 0.1, far: 120, position: [0, 3.2, 9] }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
    >
      <GameSceneContent resetToken={resetToken} />
    </Canvas>
  );
}
