export type GameStatus = 'start' | 'playing' | 'gameover';

export type EntityKind = 'ring' | 'obstacle';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface WorldEntity {
  id: number;
  kind: EntityKind;
  position: Vec3;
  /** Half-extents for obstacles; unused for rings */
  size: Vec3;
  /** Outer radius for rings */
  radius: number;
  scored: boolean;
}

export interface CorridorConfig {
  halfWidth: number;
  wallHeight: number;
  wallLength: number;
}

export const CORRIDOR: CorridorConfig = {
  halfWidth: 3.2,
  wallHeight: 2.4,
  wallLength: 80,
};

export const SHIP_RADIUS = 0.28;
export const RING_TUBE = 0.08;
export const BASE_SPEED = 8;
export const SPEED_PER_SCORE = 0.12;
export const MAX_SPEED = 22;
export const STEER_SPEED = 10;
export const SPAWN_AHEAD = 48;
export const RECYCLE_Z = 6;
