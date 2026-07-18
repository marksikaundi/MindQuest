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

function laneX(): number {
  const laneSpread = CORRIDOR.halfWidth - 0.9;
  return randomBetween(-laneSpread, laneSpread);
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
      position: { x: laneX(), y: 0, z },
      size: { x: 0, y: 0, z: 0 },
      radius: 1.05,
      scored: false,
    };
  }

  const grow = Math.min(0.35, scoreHint * 0.01);
  const halfW = 0.45 + grow;
  const halfH = 0.55 + grow * 0.5;

  return {
    id: nextId++,
    kind: 'obstacle',
    position: { x: laneX(), y: halfH - 0.1, z },
    size: { x: halfW, y: halfH, z: 0.4 },
    radius: 0,
    scored: false,
  };
}

export function initialEntities(): WorldEntity[] {
  const entities: WorldEntity[] = [];
  let z = -12;
  let toggle = true;

  while (z > -SPAWN_AHEAD) {
    const kind: EntityKind = toggle ? 'ring' : 'obstacle';
    entities.push(createEntity(kind, z, 0));
    z -= toggle ? randomBetween(7, 10) : randomBetween(5, 8);
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
  const gap = randomBetween(6, 10);
  const z = farthestZ - gap;

  if (entity.kind === 'ring') {
    entity.position.x = laneX();
    entity.position.y = 0;
    entity.position.z = z;
    entity.radius = 1.05;
    entity.scored = false;
    return;
  }

  const grow = Math.min(0.35, score * 0.01);
  const halfW = 0.45 + grow;
  const halfH = 0.55 + grow * 0.5;
  entity.position.x = laneX();
  entity.position.y = halfH - 0.1;
  entity.position.z = z;
  entity.size = { x: halfW, y: halfH, z: 0.4 };
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
