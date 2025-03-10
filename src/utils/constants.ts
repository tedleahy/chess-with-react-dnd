import knightImage from '../assets/drag-preview-images/knight.png';
import bishopImage from '../assets/drag-preview-images/bishop.png';
import rookImage from '../assets/drag-preview-images/rook.png';

export const ItemTypes = {
  PIECE: 'piece',
};

export const BOARD_SIZE = 800;
export const PIECE_SIZE = BOARD_SIZE / 10;

export const PIECE_CHARS: Record<string, string> = {
  knight: '♘',
  bishop: '♗',
  rook: '♖',
};

// Map from coordinates to piece name
export type PiecePositions = Record<string, string>;

export const initialPiecePositions: PiecePositions = {
  '0,0': 'rook',
  '1,0': 'knight',
  '2,0': 'bishop',
  '5,0': 'bishop',
  '6,0': 'knight',
  '7,0': 'rook',
};


export const DRAG_PREVIEW_IMAGES: Record<string, string> = {
  knight: knightImage,
  bishop: bishopImage,
  rook: rookImage,
};