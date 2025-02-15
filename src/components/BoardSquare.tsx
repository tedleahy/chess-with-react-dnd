import { PropsWithChildren } from 'react';
import Square from './Square';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
import { validMove } from '../utils';
import Overlay from './Overlay';
import { PiecePositions } from './Board';

interface BoardSquareProps {
  x: number;
  y: number;
  setPiecePositions: React.Dispatch<React.SetStateAction<PiecePositions>>;
}

export default function BoardSquare({
  x,
  y,
  setPiecePositions,
  children,
}: PropsWithChildren<BoardSquareProps>) {
  const color = (x + y) % 2 === 1 ? 'black' : 'white';

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PIECE,
      canDrop: (item: { x: number; y: number; name: string }) =>
        validMove([item.x, item.y], [x, y], item.name),
      drop: (item: { x: number; y: number; name: string }) => {
        setPiecePositions((prev: PiecePositions) => {
          const newPiecePositions = { ...prev };
          delete newPiecePositions[`${item.x},${item.y}`];
          newPiecePositions[`${x},${y}`] = item.name;
          return newPiecePositions;
        });
      },
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
