import { PropsWithChildren } from 'react';

interface SquareProps {
  color: 'black' | 'white';
}

export default function Square({ color, children }: PropsWithChildren<SquareProps>) {
  const stroke = color === 'black' ? 'white' : 'black';

  return (
    <div
      style={{
        backgroundColor: color,
        width: '100%',
        height: '100%',
        color: stroke,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
}
