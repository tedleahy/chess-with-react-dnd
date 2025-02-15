import knightImage from '../assets/drag-preview-images/knight.png';

export const ItemTypes = {
  PIECE: 'piece',
};

export const BOARD_SIZE = 800;
export const PIECE_SIZE = BOARD_SIZE / 10;

export const PIECE_CHARS: Record<string, string> = {
  knight: '♘',
  bishop: '♗',
};

export const DRAG_PREVIEW_IMAGES: Record<string, string> = {
  knight: knightImage,
};