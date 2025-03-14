import { PropsWithChildren } from 'react';
import Square from './Square';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { ItemTypes, Piece, PieceColor, PiecePositions } from '../utils/constants';
import { validMove } from '../utils/moveValidations';
import Overlay from './Overlay';

interface BoardSquareProps {
  x: number;
  y: number;
  setPiecePositions: React.Dispatch<React.SetStateAction<PiecePositions>>;
}

type PieceDropItem = Piece & { x: number; y: number; name: string; color: PieceColor };

export default function BoardSquare({
  x,
  y,
  setPiecePositions,
  children,
}: PropsWithChildren<BoardSquareProps>) {
  const color = (x + y) % 2 === 1 ? '#b58863' : '#f0d9b5';

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PIECE,
      canDrop: (item: PieceDropItem) => validMove([item.x, item.y], [x, y], item.name, item.color),
      drop: (item: PieceDropItem) => {
        setPiecePositions((prev: PiecePositions) => {
          const newPiecePositions = { ...prev };
          delete newPiecePositions[`${item.x},${item.y}`];
          newPiecePositions[`${x},${y}`] = { name: item.name, color: item.color };
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
      {isOver && !canDrop && <Overlay color="red" />}
      {!isOver && canDrop && <Overlay color="yellow" />}
      {isOver && canDrop && <Overlay color="green" />}
    </div>
  );
}
