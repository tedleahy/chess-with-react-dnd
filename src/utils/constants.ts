import knightImage from '../assets/drag-preview-images/knight.png';
import bishopImage from '../assets/drag-preview-images/bishop.png';
import rookImage from '../assets/drag-preview-images/rook.png';
import queenImage from '../assets/drag-preview-images/queen.png';
import kingImage from '../assets/drag-preview-images/king.png';
import pawnImage from '../assets/drag-preview-images/pawn.png';

export const ItemTypes = {
  PIECE: 'piece',
};

export const BOARD_SIZE = 800;
export const PIECE_SIZE = BOARD_SIZE / 10;

export const PIECE_CHARS: Record<string, string> = {
  knight: '♞',
  bishop: '♝',
  rook: '♜',
  queen: '♛',
  king: '♚',
  pawn: '♟',
};

// Map from coordinates to piece name
type Piece = {
  name: string;
  color: 'white' | 'black'
};
export type PiecePositions = Record<string, Piece>;

export const initialPiecePositions: PiecePositions = {
  '0,0': { name: 'rook', color: 'black' },
  '1,0': { name: 'knight', color: 'black' },
  '2,0': { name: 'bishop', color: 'black' },
  '3,0': { name: 'queen', color: 'black' },
  '4,0': { name: 'king', color: 'black' },
  '5,0': { name: 'bishop', color: 'black' },
  '6,0': { name: 'knight', color: 'black' },
  '7,0': { name: 'rook', color: 'black' },

  '0,7': { name: 'rook', color: 'white' },
  '1,7': { name: 'knight', color: 'white' },
  '2,7': { name: 'bishop', color: 'white' },
  '3,7': { name: 'king', color: 'white' },
  '4,7': { name: 'queen', color: 'white' },
  '5,7': { name: 'bishop', color: 'white' },
  '6,7': { name: 'knight', color: 'white' },
  '7,7': { name: 'rook', color: 'white' },
};

for (let i = 0; i < 8; i++) {
  initialPiecePositions[`${i},1`] = { name: 'pawn', color: 'black' };
  initialPiecePositions[`${i},6`] = { name: 'pawn', color: 'white' };
}


export const DRAG_PREVIEW_IMAGES: Record<string, string> = {
  knight: knightImage,
  bishop: bishopImage,
  rook: rookImage,
  queen: queenImage,
  king: kingImage,
  pawn: pawnImage,
};