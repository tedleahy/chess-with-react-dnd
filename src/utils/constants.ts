import { ValidMoves, withValidMoves } from './moveValidations';

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

export type PieceColor = 'white' | 'black';
export type ChessPiece = {
    name: string;
    color: PieceColor;
    validMoves?: ValidMoves;
};
export type PiecePositions = Record<string, ChessPiece>;

export let initialPiecePositions: PiecePositions = {
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
    '3,7': { name: 'queen', color: 'white' },
    '4,7': { name: 'king', color: 'white' },
    '5,7': { name: 'bishop', color: 'white' },
    '6,7': { name: 'knight', color: 'white' },
    '7,7': { name: 'rook', color: 'white' },
};

for (let i = 0; i < 8; i++) {
    initialPiecePositions[`${i},1`] = { name: 'pawn', color: 'black' };
    initialPiecePositions[`${i},6`] = { name: 'pawn', color: 'white' };
}

initialPiecePositions = withValidMoves(initialPiecePositions);
