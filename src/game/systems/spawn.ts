import {
  CORRIDOR,
  SPAWN_AHEAD,
  type EntityKind,
  type WorldEntity,
} from '../types';

let nextId = 1;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Prefer readable lane positions instead of pure noise. */
function laneX(scoreHint = 0): number {
  const laneSpread = CORRIDOR.halfWidth - 1.0;
  const lanes = [-laneSpread, -laneSpread * 0.45, 0, laneSpread * 0.45, laneSpread];
  // Early game: keep more center-biased for fair starts
  if (scoreHint < 4) {
    const early = [-laneSpread * 0.5, 0, laneSpread * 0.5];
    return early[Math.floor(Math.random() * early.length)] ?? 0;
  }
  return lanes[Math.floor(Math.random() * lanes.length)] ?? 0;
}

export function createEntity(
  kind: EntityKind,
  z: number,
  scoreHint = 0,
): WorldEntity {
  if (kind === 'ring') {
    return {
      id: nextId++,
      kind: 'ring',
      position: { x: laneX(scoreHint), y: 0.15, z },
      size: { x: 0, y: 0, z: 0 },
      radius: 1.08,
      scored: false,
    };
  }

  const grow = Math.min(0.4, scoreHint * 0.012);
  const halfW = 0.42 + grow;
  const halfH = 0.5 + grow * 0.45;

  return {
    id: nextId++,
    kind: 'obstacle',
    position: { x: laneX(scoreHint), y: 0.35 + grow * 0.2, z },
    size: { x: halfW, y: halfH, z: 0.38 },
    radius: 0,
    scored: false,
  };
}

export function initialEntities(): WorldEntity[] {
  const entities: WorldEntity[] = [];
  let z = -14;
  let toggle = true;

  while (z > -SPAWN_AHEAD) {
    const kind: EntityKind = toggle ? 'ring' : 'obstacle';
    entities.push(createEntity(kind, z, 0));
    z -= toggle ? randomBetween(7.5, 10.5) : randomBetween(5.5, 8.5);
    toggle = !toggle;
  }

  return entities;
}

/** Recycle in place — keeps id and kind so React mesh trees stay valid. */
export function recycleEntity(
  entity: WorldEntity,
  farthestZ: number,
  score: number,
): void {
  const gap = randomBetween(6.2, 10.5);
  const z = farthestZ - gap;

  if (entity.kind === 'ring') {
    entity.position.x = laneX(score);
    entity.position.y = 0.15;
    entity.position.z = z;
    entity.radius = 1.08;
    entity.scored = false;
    return;
  }

  const grow = Math.min(0.4, score * 0.012);
  const halfW = 0.42 + grow;
  const halfH = 0.5 + grow * 0.45;
  entity.position.x = laneX(score);
  entity.position.y = 0.35 + grow * 0.2;
  entity.position.z = z;
  entity.size = { x: halfW, y: halfH, z: 0.38 };
  entity.scored = false;
}

export function farthestEntityZ(entities: readonly WorldEntity[]): number {
  let min = 0;
  for (const entity of entities) {
    if (entity.position.z < min) {
      min = entity.position.z;
    }
  }
  return min;
}
