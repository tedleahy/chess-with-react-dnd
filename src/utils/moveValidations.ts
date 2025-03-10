import { PieceColor } from './constants';

export function validMove(from: number[], to: number[], piece: string, color?: PieceColor) {
  switch (piece) {
    case 'knight':
      return validKnightMove(from, to);
    case 'bishop':
      return validBishopMove(from, to);
    case 'rook':
      return validRookMove(from, to);
    case 'queen':
      return validQueenMove(from, to);
    case 'king':
      return validKingMove(from, to);
    case 'pawn':
      if (color === undefined) throw new Error('color is required for pawn moves');
      return validPawnMove(from, to, color);
    default:
      return false;
  }
}

function validKnightMove([fromX, fromY]: number[], [toX, toY]: number[]) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);

  // A knight moves in an L shape, so by 2 squares in one axis and 1 in the other.
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

function validBishopMove([fromX, fromY]: number[], [toX, toY]: number[]) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);

  // A bishop moves diagonally, so the absolute change in x and y must be equal,
  // i.e. if it moves one square up/down, it must also move one square left/right.
  // It must also move at least one square.
  return dx === dy && dx > 0;
}

function validRookMove([fromX, fromY]: number[], [toX, toY]: number[]) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);

  // A rook moves horizontally or vertically, so can only move in one axis at a time.
  // That means one axis must stay the same. It must also move at least one square
  // along either axis.
  return (dx === 0 || dy === 0) && (dx > 0 || dy > 0);
}

function validQueenMove(from: number[], to: number[]) {
  // A queen is effectively a combination of a rook and a bishop - it can move
  // horizontally, vertically, or diagonally.
  return validRookMove(from, to) || validBishopMove(from, to);
}

function validKingMove([fromX, fromY]: number[], [toX, toY]: number[]) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);

  // A king can move in any direction, but only one square at a time.
  return (dx > 0 || dy > 0) && dx <= 1 && dy <= 1;
}

function validPawnMove([fromX, fromY]: number[], [toX, toY]: number[], color: PieceColor) {
  const dx = toX - fromX;
  const dy = toY - fromY;

  // A pawn can move forward one square
  // TODO implement capturing diagonally
  // TODO implement moving two squares if it hasn't moved yet
  if (color === 'black') {
    return dx === 0 && dy === 1;
  } else {
    return dx === 0 && dy === -1;
  }
}
