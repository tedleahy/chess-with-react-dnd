import { DndProvider } from 'react-dnd';
import Knight from './pieces/Knight';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoardSquare from './BoardSquare';

interface BoardProps {
  boardSize: number;
  knightPosition: number[];
}

export default function Board({ boardSize, knightPosition }: BoardProps) {
  const pieceSize = boardSize / 10;
  const squares = [];
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i, pieceSize, knightPosition));
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          width: boardSize,
          height: boardSize,
          display: 'flex',
          flexWrap: 'wrap',
          border: '1px solid black',
        }}
      >
        {squares}
      </div>
    </DndProvider>
  );
}

function renderSquare(squareNumber: number, pieceSize: number, [knightX, knightY]: number[]) {
  const x = squareNumber % 8;
  const y = Math.floor(squareNumber / 8);
  const isKnightHere = knightX === x && knightY === y;
  const piece = isKnightHere ? <Knight fontSize={pieceSize} /> : null;

  return (
    <div key={`square-${squareNumber}`} style={{ width: '12.5%', height: '12.5%' }}>
      <BoardSquare x={x} y={y}>
        {piece}
      </BoardSquare>
    </div>
  );
}
