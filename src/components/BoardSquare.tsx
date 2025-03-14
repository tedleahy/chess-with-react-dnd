import { PropsWithChildren } from 'react';
import Square from './Square';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
import { moveKnight, validKnightMove } from '../utils';
import Overlay from './Overlay';

interface BoardSquareProps {
  x: number;
  y: number;
}

export default function BoardSquare({ x, y, children }: PropsWithChildren<BoardSquareProps>) {
  const color = (x + y) % 2 === 1 ? 'black' : 'white';

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.KNIGHT,
      canDrop: () => validKnightMove(x, y),
      drop: () => moveKnight(x, y),
      collect: (monitor: DropTargetMonitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [x, y],
  );

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Square color={color}>{children}</Square>
      {isOver && !canDrop && <Overlay color='red' />}
      {!isOver && canDrop && <Overlay color='yellow' />}
      {isOver && canDrop && <Overlay color='green' />}
    </div>
  );
}
