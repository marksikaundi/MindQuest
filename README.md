# Ring Runner

A 3D endless flyer built with **Expo**, **TypeScript**, **Three.js**, and **React Three Fiber**.

Steer a glowing ship through a neon corridor. Thread cyan rings for points, dodge crimson obstacles, and beat your local high score as the world speeds up.

## Stack

- Expo SDK 57 + Expo Router
- `expo-gl` + `three` + `@react-three/fiber` (native / web Canvas)
- `react-native-gesture-handler` for swipe steering
- `@react-native-async-storage/async-storage` for high score
- Zustand for game state

## Run

```bash
npm install
npm run web      # best path to verify GL in this environment
npm start       # Expo Go on a phone
```

### Controls

- **Mobile:** swipe, or hold left / right half of the screen
- **Web:** drag, click sides, or use `A` / `D` / arrow keys

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
