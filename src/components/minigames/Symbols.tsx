import Svg, { Circle, Ellipse, Path, Polygon, Rect } from 'react-native-svg';

import type { MatchPattern, MatchShape, MemorySymbol } from '@/data/minigames';

export function MemoryGlyph({ symbol, size = 36 }: { symbol: MemorySymbol; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 48 48' };
  switch (symbol) {
    case 'sun':
      return (
        <Svg {...common}>
          <Circle cx="24" cy="24" r="8" fill="#E8A317" />
          <Path d="M24 6 V14 M24 34 V42 M6 24 H14 M34 24 H42 M11 11 L16 16 M32 32 L37 37 M37 11 L32 16 M16 32 L11 37" stroke="#E8A317" strokeWidth="3" />
        </Svg>
      );
    case 'moon':
      return (
        <Svg {...common}>
          <Path d="M28 8 A16 16 0 1 0 28 40 A12 12 0 1 1 28 8" fill="#6C63FF" />
        </Svg>
      );
    case 'star':
      return (
        <Svg {...common}>
          <Polygon points="24,4 29,18 44,18 32,28 36,44 24,34 12,44 16,28 4,18 19,18" fill="#FFC857" />
        </Svg>
      );
    case 'leaf':
      return (
        <Svg {...common}>
          <Ellipse cx="24" cy="24" rx="12" ry="18" fill="#2F9E6B" transform="rotate(-30 24 24)" />
          <Path d="M16 34 L30 16" stroke="#F5F7FF" strokeWidth="2" />
        </Svg>
      );
    case 'key':
      return (
        <Svg {...common}>
          <Circle cx="18" cy="20" r="8" fill="none" stroke="#E8A317" strokeWidth="4" />
          <Path d="M24 24 L40 40 M32 34 H40 M32 40 H38" stroke="#E8A317" strokeWidth="4" />
        </Svg>
      );
    case 'mushroom':
      return (
        <Svg {...common}>
          <Path d="M8 26 Q24 6 40 26 Z" fill="#E85D75" />
          <Rect x="20" y="26" width="8" height="14" rx="3" fill="#F6D3B8" />
          <Circle cx="18" cy="20" r="2" fill="#FFFFFF" />
          <Circle cx="28" cy="18" r="2" fill="#FFFFFF" />
        </Svg>
      );
    case 'crystal':
      return (
        <Svg {...common}>
          <Polygon points="24,4 38,18 24,44 10,18" fill="#45C4B0" />
        </Svg>
      );
    case 'heart':
      return (
        <Svg {...common}>
          <Path d="M24 40 L8 22 A8 8 0 0 1 24 16 A8 8 0 0 1 40 22 Z" fill="#E85D75" />
        </Svg>
      );
    case 'tree':
      return (
        <Svg {...common}>
          <Rect x="21" y="28" width="6" height="12" fill="#8A5A3A" />
          <Polygon points="24,6 40,30 8,30" fill="#2F9E6B" />
        </Svg>
      );
    case 'flower':
      return (
        <Svg {...common}>
          <Circle cx="24" cy="16" r="6" fill="#E85D75" />
          <Circle cx="16" cy="24" r="6" fill="#FFC857" />
          <Circle cx="32" cy="24" r="6" fill="#6C63FF" />
          <Circle cx="24" cy="24" r="4" fill="#F5F7FF" />
        </Svg>
      );
    case 'book':
      return (
        <Svg {...common}>
          <Path d="M8 10 H24 V40 H8 Z M24 10 H40 V40 H24 Z" fill="#3D7EA6" />
          <Path d="M24 10 V40" stroke="#F5F7FF" strokeWidth="2" />
        </Svg>
      );
    case 'gem':
      return (
        <Svg {...common}>
          <Polygon points="24,6 40,18 24,42 8,18" fill="#8E4EC6" />
          <Path d="M8 18 H40" stroke="#F5F7FF" strokeWidth="2" />
        </Svg>
      );
    default:
      return null;
  }
}

export function ShapeGlyph({
  shape,
  color,
  pattern,
  size = 42,
}: {
  shape: MatchShape;
  color: string;
  pattern: MatchPattern;
  size?: number;
}) {
  const mark = pattern === 'stripes' ? '|' : pattern === 'dots' ? '•' : '';
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {shape === 'circle' ? <Circle cx="24" cy="24" r="16" fill={color} /> : null}
      {shape === 'square' ? <Rect x="8" y="8" width="32" height="32" rx="4" fill={color} /> : null}
      {shape === 'triangle' ? <Polygon points="24,6 44,42 4,42" fill={color} /> : null}
      {shape === 'diamond' ? <Polygon points="24,4 44,24 24,44 4,24" fill={color} /> : null}
      {shape === 'hex' ? <Polygon points="16,6 32,6 44,24 32,42 16,42 4,24" fill={color} /> : null}
      {shape === 'star' ? <Polygon points="24,4 29,18 44,18 32,28 36,44 24,34 12,44 16,28 4,18 19,18" fill={color} /> : null}
      {pattern === 'stripes' ? <Path d="M14 8 L20 40 M24 8 L30 40" stroke="#FFFFFF" strokeWidth="3" /> : null}
      {pattern === 'dots' ? <Circle cx="24" cy="24" r="4" fill="#FFFFFF" /> : null}
      {mark ? null : null}
    </Svg>
  );
}
