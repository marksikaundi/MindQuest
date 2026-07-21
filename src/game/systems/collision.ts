import {
  CORRIDOR,
  RING_TUBE,
  SHIP_RADIUS,
  type WorldEntity,
} from '../types';

export function hitsWall(shipX: number): boolean {
  return Math.abs(shipX) > CORRIDOR.halfWidth - SHIP_RADIUS;
}

export function hitsObstacle(shipX: number, shipZ: number, entity: WorldEntity): boolean {
  if (entity.kind !== 'obstacle') {
    return false;
  }

  const dx = Math.abs(shipX - entity.position.x);
  const dz = Math.abs(shipZ - entity.position.z);
  const dy = Math.abs(0.05 - entity.position.y);
  // Slightly forgiving hitbox so motion feels fair at higher speeds
  const pad = SHIP_RADIUS * 0.82;

  return (
    dx < entity.size.x + pad &&
    dy < entity.size.y + pad &&
    dz < entity.size.z + pad
  );
}

/** Returns true when the ship center passes through the ring aperture. */
export function passesRing(shipX: number, shipZ: number, entity: WorldEntity): boolean {
  if (entity.kind !== 'ring' || entity.scored) {
    return false;
  }

  const dz = shipZ - entity.position.z;
  if (Math.abs(dz) > 0.45) {
    return false;
  }

  const dx = shipX - entity.position.x;
  const dy = 0.08 - entity.position.y;
  const radial = Math.hypot(dx, dy);
  const inner = entity.radius - RING_TUBE - SHIP_RADIUS * 0.25;

  return radial < inner;
}

export function shipCollides(
  shipX: number,
  shipZ: number,
  entities: readonly WorldEntity[],
): boolean {
  if (hitsWall(shipX)) {
    return true;
  }

  for (const entity of entities) {
    if (hitsObstacle(shipX, shipZ, entity)) {
      return true;
    }
  }

  return false;
}
