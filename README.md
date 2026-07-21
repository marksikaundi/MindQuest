# Ring Runner

A 3D endless flyer built with **Expo**, **TypeScript**, **Three.js**, and **React Three Fiber**.

Steer a glowing ship through a neon corridor. Thread cyan rings for points, dodge crimson obstacles, and beat your local high score as the world speeds up.

## How to play

### Goal

Fly as far as you can without crashing. Pass through **cyan rings** to score points. Avoid **crimson obstacles** and the corridor walls. The run ends when you hit either.

### Controls

| Platform | How to steer |
|----------|----------------|
| **Mobile / touch** | Drag anywhere on the screen. Your finger’s horizontal position maps to the ship’s lane — left side of the screen = left lane, right side = right lane. |
| **Web** | Drag with the mouse the same way, **or** hold `A` / `←` to move left and `D` / `→` to move right. Release to hold your current lane. |

Tap **PLAY** on the title screen to start. After a crash, tap **RETRY** to run again.

### Scoring

- Each ring you fly **through the center** of adds **1 point**.
- Grazing a ring without passing the aperture does not score.
- Hitting an obstacle or a wall ends the run immediately.
- Your **best score** is saved on device and shown on the HUD and title screen.

### Difficulty

- Speed rises as your score climbs — later rings and hazards come at you faster.
- Early rings stay closer to the center; later spawns use wider lanes.
- Obstacles slowly grow as the run goes on.

### Tips

1. Keep the ship centered when you can — you have more time to react left or right.
2. Steer early; the ship springs toward your target, so last-second flicks can miss a ring.
3. Watch for spinning crimson shapes — they block the lane, not just the center.
4. On web, hold a key for smooth lane changes; drag when you need a precise line through a ring.

## Stack

- Expo SDK 57 + Expo Router
- `expo-gl` + `three` + `@react-three/fiber` (native / web Canvas)
- `react-native-gesture-handler` for drag steering
- `@react-native-async-storage/async-storage` for high score
- Zustand for game state

## Run

```bash
npm install
npm run web      # best path to verify GL in this environment
npm start       # Expo Go on a phone
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Expo dev server |
| `npm run web` | Web (primary smoke-test target) |
| `npm run typecheck` | TypeScript `--noEmit` |

## Project layout

```
app/                 Expo Router screens
src/game/            3D scene, ship, world, systems, store
src/ui/              HUD + overlays
```
