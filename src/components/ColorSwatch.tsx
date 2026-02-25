import type { FC } from 'react';

interface ColorSwatchProps {
  color: string;
  size?: number;
}

const ColorSwatch: FC<ColorSwatchProps> = ({ color, size = 14 }) => {
  return (
    <span
      data-testid="color-swatch"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        border: '2px solid white',
        boxShadow: '0 0 2px rgba(0,0,0,0.2)',
        flexShrink: 0,
      }}
    />
  );
};

export default ColorSwatch;
