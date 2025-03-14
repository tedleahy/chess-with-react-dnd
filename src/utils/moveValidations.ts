import { PieceColor, PiecePositions } from './constants';

// Lookup table that maps from a possible position to whether a move there is valid
export type ValidMoves = Record<string, boolean>;

export function isValidMove(
  [currentX, currentY]: number[],
  [targetX, targetY]: number[],
  piecePositions: PiecePositions,
) {
  const validMoves = piecePositions[`${currentX},${currentY}`]?.validMoves;
  if (!validMoves) return false;

  return validMoves[`${targetX},${targetY}`];
}

const rookDirections = [
  [-1, 0], // Left
  [1, 0], // Right
  [0, -1], // Forwards
  [0, 1], // Backwards
];

const bishopDirections = [
  [-1, -1], // Diagonally left and forward
  [1, -1], // Diagonally right and forward
  [-1, 1], // Diagonally left and backwards
  [1, 1], // Diagonally right and backwards
];

const validDirectionsForPiece: Record<string, number[][]> = {
  rook: rookDirections,
  bishop: bishopDirections,
  // A queen is effectively a combination of a rook and a bishop - it can move horizontally, vertically, or diagonally.
  queen: [...rookDirections, ...bishopDirections],
  // Same for a king in terms of the directions it can move in
  king: [...rookDirections, ...bishopDirections],
  knight: [
    [-1, -2], // 1 space left, 2 spaces forward
    [-2, -1], // 2 spaces left, 1 space forward
    [1, -2], // 1 space right, 2 spaces forward
    [2, -1], // 2 spaces right, 1 space forward
    [-1, 2], // 1 space left, 2 spaces backwards
    [-2, 1], // 2 spaces left, 1 space backwards
    [1, 2], // 1 space right, 2 spaces backwards
    [2, 1], // 2 spaces right, 1 space backwards
  ],
  pawn: [
    [0, 1], // 1 space forward
    [0, 2], // 2 spaces forward (on its first move)
    [-1, 1], // Diagonally forwards and left (when capturing)
    [1, 1], // Diagonally forwards and right (when capturing)
  ],
};

function withinBoardBounds(x: number, y: number) {
  return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}

export function getValidMoves(
  x: number,
  y: number,
  pieceName: string,
  color: PieceColor,
  piecePositions: PiecePositions,
): ValidMoves {
  if (pieceName === 'pawn') return getValidPawnMoves(x, y, color, piecePositions);

  const directions = validDirectionsForPiece[`${pieceName}`];
  const validMoves: ValidMoves = {};

  for (const [dx, dy] of directions) {
    let currentX = x + dx;
    let currentY = y + dy;

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

      // Knights and kings can only move once in a given direction, so break after the first iteration
      if (pieceName === 'knight' || pieceName === 'king') break;

      currentX += dx;
      currentY += dy;
    }
  }

  return validMoves;
}

// Pawns have quite specific logic to how they move under different conditions, so they get their
// own special function
function getValidPawnMoves(
  x: number,
  y: number,
  color: PieceColor,
  piecePositions: PiecePositions,
): ValidMoves {
  const directions = validDirectionsForPiece.pawn;
  const isFirstMove = color === 'black' ? y === 1 : y === 6;

  const validMoves: ValidMoves = {};

  for (const [dx, dy] of directions) {
    const currentX = x + dx;
    const currentY = color === 'black' ? y + dy : y - dy;

    // Prevent moving off the board
    if (!withinBoardBounds(currentX, currentY)) continue;
    // Prevent moving onto a square that contains a piece of the same colour
    if (squareContainsSameColorPiece(currentX, currentY, color, piecePositions)) continue;
    // Prevent moving 2 squares forward unless it's this pawn's first move
    if (dy === 2 && !isFirstMove) continue;

    const pieceOnSquare = piecePositions[`${currentX},${currentY}`];
    // Prevent diagonal moves unless there's another piece in that square (i.e. it's capturing)
    if (dx !== 0 && !pieceOnSquare) continue;
    // Prevent moving forward if there's an opponent's piece in that square - pawns can only capture diagonally
    if (dx === 0 && pieceOnSquare) continue;

    validMoves[`${currentX},${currentY}`] = true;
  }

  return validMoves;
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

// For each piece, calculate all the valid moves it can make, and update its valid moves in piecePositions
export function setValidMovesInPiecePositions(piecePositions: PiecePositions) {
  for (const [position, piece] of Object.entries(piecePositions)) {
    const [x, y] = position.split(',').map(Number);
    piece.validMoves = getValidMoves(x, y, piece.name, piece.color, piecePositions);
  }
}
