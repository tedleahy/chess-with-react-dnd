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

export const DRAG_PREVIEW_IMAGES: Record<string, string> = {
  knight: knightImage,
  bishop: bishopImage,
  rook: rookImage,
};