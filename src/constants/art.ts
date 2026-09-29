export const art = {
  logo: require('@/assets/images/game/mindquest-logo.png'),
  questland: require('@/assets/images/game/questland-village.png'),
  map: require('@/assets/images/game/world-map.png'),
  valley: require('@/assets/images/game/puzzle-valley.png'),
  forest: require('@/assets/images/game/adventure-forest.png'),
  home: require('@/assets/images/game/player-home.png'),
  city: require('@/assets/images/game/creative-city.png'),
  island: require('@/assets/images/game/knowledge-island.png'),
  mountain: require('@/assets/images/game/challenge-mountain.png'),
  wood: require('@/assets/game/textures/wood-floor.jpg'),
  music: require('@/assets/sounds/questland-loop.wav'),
} as const;

export const kenney = {
  home: require('@/assets/game/kenney/home.png'),
  star: require('@/assets/game/kenney/star.png'),
  trophy: require('@/assets/game/kenney/trophy.png'),
  gear: require('@/assets/game/kenney/gear.png'),
  audioOn: require('@/assets/game/kenney/audioOn.png'),
  audioOff: require('@/assets/game/kenney/audioOff.png'),
  musicOn: require('@/assets/game/kenney/musicOn.png'),
  musicOff: require('@/assets/game/kenney/musicOff.png'),
  save: require('@/assets/game/kenney/save.png'),
  checkmark: require('@/assets/game/kenney/checkmark.png'),
  cross: require('@/assets/game/kenney/cross.png'),
  contrast: require('@/assets/game/kenney/contrast.png'),
  exclamation: require('@/assets/game/kenney/exclamation.png'),
  information: require('@/assets/game/kenney/information.png'),
  return: require('@/assets/game/kenney/return.png'),
  target: require('@/assets/game/kenney/target.png'),
  locked: require('@/assets/game/kenney/locked.png'),
  medal: require('@/assets/game/kenney/medal1.png'),
  cart: require('@/assets/game/kenney/shoppingCart.png'),
  unlocked: require('@/assets/game/kenney/unlocked.png'),
} as const;

export type KenneyName = keyof typeof kenney;
