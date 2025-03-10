import { PieceDropItem } from '../components/BoardSquare';
import { PieceColor, PiecePositions } from './constants';

// Lookup table that maps from a possible position to whether a move there is valid
export type ValidMoves = Record<string, boolean>;

export function validMove(
  { x, y, name, color }: PieceDropItem,
  [toX, toY]: number[],
  piecePositions: PiecePositions,
) {
  const from = [x, y];
  const to = [toX, toY];

  switch (name) {
    case 'knight':
      return validKnightMove(from, to, color, piecePositions);
    case 'bishop':
      return validBishopMove(from, to, color, piecePositions);
    case 'rook':
      return validRookMove(from, to, color, piecePositions);
    case 'queen':
      return validQueenMove(from, to, color, piecePositions);
    case 'king':
      return validKingMove(from, to, color, piecePositions);
    case 'pawn':
      if (color === undefined) throw new Error('color is required for pawn moves');
      return validPawnMove(from, to, color, piecePositions);
    default:
      return false;
  }
}

export function isValidMove(
  [currentX, currentY]: number[],
  [targetX, targetY]: number[],
  piecePositions: PiecePositions,
) {
  const validMoves = piecePositions[`${currentX},${currentY}`]?.validMoves;
  if (!validMoves) return false;

  return validMoves[`${targetX},${targetY}`];
}

export function getValidMoves(
  x: number,
  y: number,
  name: string,
  color: PieceColor,
  piecePositions: PiecePositions,
): ValidMoves {
  switch (name) {
    case 'rook':
      return validRookMoves(x, y, color, piecePositions);
    default:
      return {};
  }
}

function validRookMoves(
  x: number,
  y: number,
  color: PieceColor,
  piecePositions: PiecePositions,
): ValidMoves {
  const directions = [
    [-1, 0], // Left
    [1, 0], // Right
    [0, -1], // Up
    [0, 1], // Down
  ];

  const validMoves: ValidMoves = {};

  for (const [dx, dy] of directions) {
    let currentX = x + dx;
    let currentY = y + dy;

    const withinBoardBounds = (x: number, y: number) => x >= 0 && x <= 7 && y >= 0 && y <= 7;

    while (withinBoardBounds(currentX, currentY)) {
      if (squareContainsSameColorPiece(currentX, currentY, color, piecePositions)) {
        break;
      }

      validMoves[`${currentX},${currentY}`] = true;

      // If we encounter an opponent's piece, we can capture it but can't go further
      const pieceOnSquare = piecePositions[`${currentX},${currentY}`];
      if (pieceOnSquare && pieceOnSquare.color !== color) {
        break;
      }

      currentX += dx;
      currentY += dy;
    }
  }

  return validMoves;
}

function validKnightMove(
  [fromX, fromY]: number[],
  [toX, toY]: number[],
  color: PieceColor,
  piecePositions: PiecePositions,
) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);
  // A knight moves in an L shape, so by 2 squares in one axis and 1 in the other.
  const squareIsValid = (dx === 2 && dy === 1) || (dx === 1 && dy === 2);

  return squareIsValid && !squareContainsSameColorPiece(toX, toY, color, piecePositions);
}

function validBishopMove(
  [fromX, fromY]: number[],
  [toX, toY]: number[],
  color: PieceColor,
  piecePositions: PiecePositions,
) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);
  // A bishop moves diagonally, so the absolute change in x and y must be equal,
  // i.e. if it moves one square up/down, it must also move one square left/right.
  // It must also move at least one square.
  const squareIsValid = dx === dy && dx > 0 && dy > 0;

  return squareIsValid && !squareContainsSameColorPiece(toX, toY, color, piecePositions);
}

function validRookMove(
  [fromX, fromY]: number[],
  [toX, toY]: number[],
  color: PieceColor,
  piecePositions: PiecePositions,
) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);
  // A rook moves horizontally or vertically, so can only move in one axis at a time.
  // That means one axis must stay the same. It must also move at least one square
  // along either axis.
  const squareIsValid = (dx === 0 || dy === 0) && (dx > 0 || dy > 0);

  return squareIsValid && !squareContainsSameColorPiece(toX, toY, color, piecePositions);
}

function validQueenMove(
  from: number[],
  to: number[],
  color: PieceColor,
  piecePositions: PiecePositions,
) {
  // A queen is effectively a combination of a rook and a bishop - it can move
  // horizontally, vertically, or diagonally.
  return (
    validRookMove(from, to, color, piecePositions) ||
    validBishopMove(from, to, color, piecePositions)
  );
}

function validKingMove(
  [fromX, fromY]: number[],
  [toX, toY]: number[],
  color: PieceColor,
  piecePositions: PiecePositions,
) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);
  // A king can move in any direction, but only one square at a time.
  const squareIsValid = (dx > 0 || dy > 0) && dx <= 1 && dy <= 1;

  return squareIsValid && !squareContainsSameColorPiece(toX, toY, color, piecePositions);
}

function validPawnMove(
  [fromX, fromY]: number[],
  [toX, toY]: number[],
  color: PieceColor,
  piecePositions: PiecePositions,
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const isFirstMove = color === 'black' ? fromY === 1 : fromY === 6;

  // A pawn can move forward one square
  // TODO implement capturing diagonally
  let squareIsValid;

  if (color === 'black') {
    squareIsValid = dx === 0 && (isFirstMove ? dy === 1 || dy === 2 : dy === 1);
  } else {
    squareIsValid = dx === 0 && (isFirstMove ? dy === -1 || dy === -2 : dy === -1);
  }

  return squareIsValid && !squareContainsSameColorPiece(toX, toY, color, piecePositions);
}

function squareContainsSameColorPiece(
  x: number,
  y: number,
  color: PieceColor,
  piecePositions: PiecePositions,
) {
  const pieceOnSquare = piecePositions[`${x},${y}`];
  return pieceOnSquare && pieceOnSquare.color === color;
}
