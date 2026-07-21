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
  halfWidth: 3.4,
  wallHeight: 2.8,
  wallLength: 90,
};

export const SHIP_RADIUS = 0.26;
export const RING_TUBE = 0.09;
export const BASE_SPEED = 9;
export const SPEED_PER_SCORE = 0.14;
export const MAX_SPEED = 24;

/** How fast the ship springs toward the steer target */
export const STEER_RESPONSIVENESS = 14;
/** Max lateral ship speed (world units / sec) */
export const STEER_MAX_LATERAL = 16;
/** Keyboard hold moves the steer target at this rate */
export const KEYBOARD_STEER_RATE = 11;
export const SPAWN_AHEAD = 52;
export const RECYCLE_Z = 7;
