import { PropsWithChildren } from 'react';
import Square from './Square';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { ItemTypes, Piece, PiecePositions } from '../utils/constants';
import { getValidMoves, isValidMove, validMove } from '../utils/moveValidations';
import Overlay from './Overlay';

interface BoardSquareProps {
  x: number;
  y: number;
  piecePositions: PiecePositions;
  setPiecePositions: React.Dispatch<React.SetStateAction<PiecePositions>>;
}

export type PieceDropItem = Piece & { x: number; y: number };

export default function BoardSquare({
  x,
  y,
  piecePositions,
  setPiecePositions,
  children,
}: PropsWithChildren<BoardSquareProps>) {
  const color = (x + y) % 2 === 1 ? '#b58863' : '#f0d9b5';

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PIECE,
      // canDrop: (item: PieceDropItem) => validMove(item, [x, y], piecePositions),
      canDrop: (item: PieceDropItem) => {
        if (item.name === 'rook') {
          return isValidMove([item.x, item.y], [x, y], piecePositions);
        } else {
          return validMove(item, [x, y], piecePositions);
        }
      },
      drop: (item: PieceDropItem) => {
        setPiecePositions((prev: PiecePositions) => {
          const newPiecePositions = { ...prev };
          delete newPiecePositions[`${item.x},${item.y}`];

          newPiecePositions[`${x},${y}`] = {
            name: item.name,
            color: item.color,
          };

          // Recalculate the valid moves each piece can make
          for (const [position, piece] of Object.entries(newPiecePositions)) {
            const [x, y] = position.split(',').map(Number);
            piece.validMoves = getValidMoves(x, y, piece.name, piece.color, newPiecePositions);
          }

          return newPiecePositions;
        });
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [x, y, piecePositions],
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
