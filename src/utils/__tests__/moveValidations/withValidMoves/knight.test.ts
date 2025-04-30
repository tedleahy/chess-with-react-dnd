import { PiecePositions } from '../../../constants';
import { withValidMoves } from '../../../moveValidations';

describe('withValidMoves - knights', () => {
    test('a knight in the center of an empty board', () => {
        /*
              0   1   2   3   4   5   6
          0 |   |   |   |   |   |   |   |
          1 |   |   |   |   |   |   |   |
          2 |   |   |   |   |   |   |   |
          3 |   |   |   | ♘ |   |   |   |
          4 |   |   |   |   |   |   |   |
          5 |   |   |   |   |   |   |   |
          6 |   |   |   |   |   |   |   |
        */
        const piecePositions: PiecePositions = {
            '3,3': { name: 'knight', color: 'white' },
        };
        expect(withValidMoves(piecePositions)).toEqual({
            '3,3': {
                name: 'knight',
                color: 'white',
                validMoves: {
                    '1,2': true,
                    '1,4': true,
                    '2,1': true,
                    '2,5': true,
                    '4,1': true,
                    '4,5': true,
                    '5,2': true,
                    '5,4': true,
                },
            },
        });
    });

    test('a knight on the edge of the board', () => {
        /*
              0   1   2
          0 | ♞ |   |   |
          1 |   |   |   |
          2 |   |   |   |
        */
        const piecePositions: PiecePositions = {
            '0,0': { name: 'knight', color: 'black' },
        };
        expect(withValidMoves(piecePositions)).toEqual({
            '0,0': {
                name: 'knight',
                color: 'black',
                validMoves: {
                    '1,2': true,
                    '2,1': true,
                },
            },
        });
    });

    test('a knight with friendly pieces it can jump over', () => {
        /*
              0   1   2
          0 | ♞ | ♟ | ♟ |
          1 | ♟ | ♟ |   |
          2 |   |   |   |
        */
        const piecePositions: PiecePositions = {
            '0,0': { name: 'knight', color: 'black' },
            '0,1': { name: 'pawn', color: 'black' },
            '1,0': { name: 'pawn', color: 'black' },
            '1,1': { name: 'pawn', color: 'black' },
            '2,0': { name: 'pawn', color: 'black' },
        };
        expect(withValidMoves(piecePositions)).toEqual({
            '0,0': {
                name: 'knight',
                color: 'black',
                validMoves: {
                    '1,2': true,
                    '2,1': true,
                },
            },
            '0,1': { name: 'pawn', color: 'black', validMoves: { '0,2': true, '0,3': true } },
            '1,0': { name: 'pawn', color: 'black', validMoves: {} },
            '1,1': { name: 'pawn', color: 'black', validMoves: { '1,2': true, '1,3': true } },
            '2,0': { name: 'pawn', color: 'black', validMoves: { '2,1': true } },
        });
    });

    test('a knight with enemy pieces it can jump over', () => {
        /*
              0   1   2
          0 | ♘ | ♟ | ♟ |
          1 | ♟ | ♟ |   |
          2 |   |   |   |
        */
        const piecePositions: PiecePositions = {
            '0,0': { name: 'knight', color: 'white' },
            '0,1': { name: 'pawn', color: 'black' },
            '1,0': { name: 'pawn', color: 'black' },
            '1,1': { name: 'pawn', color: 'black' },
            '2,0': { name: 'pawn', color: 'black' },
        };
        expect(withValidMoves(piecePositions)).toEqual({
            '0,0': {
                name: 'knight',
                color: 'white',
                validMoves: {
                    '1,2': true,
                    '2,1': true,
                },
            },
            '0,1': { name: 'pawn', color: 'black', validMoves: { '0,2': true, '0,3': true } },
            '1,0': { name: 'pawn', color: 'black', validMoves: {} },
            '1,1': { name: 'pawn', color: 'black', validMoves: { '1,2': true, '1,3': true } },
            '2,0': { name: 'pawn', color: 'black', validMoves: { '2,1': true } },
        });
    });

    test('a knight surrounded by friendly pieces', () => {
        /*
              0   1   2   3   4   5   6
          0 |   |   |   |   |   |   |   |
          1 |   |   | ♙ |   | ♙ |   |   |
          2 |   | ♙ |   |   |   | ♙ |   |
          3 |   |   |   | ♘ |   |   |   |
          4 |   | ♙ |   |   |   | ♙ |   |
          5 |   |   | ♙ |   | ♙ |   |   |
          6 |   |   |   |   |   |   |   |
        */
        const piecePositions: PiecePositions = {
            '3,3': { name: 'knight', color: 'white' },
            '1,2': { name: 'pawn', color: 'white' },
            '1,4': { name: 'pawn', color: 'white' },
            '2,1': { name: 'pawn', color: 'white' },
            '2,5': { name: 'pawn', color: 'white' },
            '4,1': { name: 'pawn', color: 'white' },
            '4,5': { name: 'pawn', color: 'white' },
            '5,2': { name: 'pawn', color: 'white' },
            '5,4': { name: 'pawn', color: 'white' },
        };
        expect(withValidMoves(piecePositions)).toEqual({
            '3,3': {
                name: 'knight',
                color: 'white',
                validMoves: {},
            },
            '1,2': { name: 'pawn', color: 'white', validMoves: { '1,1': true } },
            '1,4': { name: 'pawn', color: 'white', validMoves: { '1,3': true } },
            '2,1': { name: 'pawn', color: 'white', validMoves: { '2,0': true } },
            '2,5': { name: 'pawn', color: 'white', validMoves: { '2,4': true } },
            '4,1': { name: 'pawn', color: 'white', validMoves: { '4,0': true } },
            '4,5': { name: 'pawn', color: 'white', validMoves: { '4,4': true } },
            '5,2': { name: 'pawn', color: 'white', validMoves: { '5,1': true } },
            '5,4': { name: 'pawn', color: 'white', validMoves: { '5,3': true } },
        });
    });

    test('a knight surrounded by enemy pieces', () => {
        /*
              0   1   2   3   4   5   6
          0 |   |   |   |   |   |   |   |
          1 |   |   | ♟ |   | ♟ |   |   |
          2 |   | ♟ |   |   |   | ♟ |   |
          3 |   |   |   | ♘ |   |   |   |
          4 |   | ♟ |   |   |   | ♟ |   |
          5 |   |   | ♟ |   | ♟ |   |   |
          6 |   |   |   |   |   |   |   |
        */
        const piecePositions: PiecePositions = {
            '3,3': { name: 'knight', color: 'white' },
            '1,2': { name: 'pawn', color: 'black' },
            '1,4': { name: 'pawn', color: 'black' },
            '2,1': { name: 'pawn', color: 'black' },
            '2,5': { name: 'pawn', color: 'black' },
            '4,1': { name: 'pawn', color: 'black' },
            '4,5': { name: 'pawn', color: 'black' },
            '5,2': { name: 'pawn', color: 'black' },
            '5,4': { name: 'pawn', color: 'black' },
        };
        expect(withValidMoves(piecePositions)).toEqual({
            '3,3': {
                name: 'knight',
                color: 'white',
                validMoves: {
                    '1,2': true,
                    '1,4': true,
                    '2,1': true,
                    '2,5': true,
                    '4,1': true,
                    '4,5': true,
                    '5,2': true,
                    '5,4': true,
                },
            },
            '1,2': { name: 'pawn', color: 'black', validMoves: { '1,3': true } },
            '1,4': { name: 'pawn', color: 'black', validMoves: { '1,5': true } },
            '2,1': { name: 'pawn', color: 'black', validMoves: { '2,2': true, '2,3': true } },
            '2,5': { name: 'pawn', color: 'black', validMoves: { '2,6': true } },
            '4,1': { name: 'pawn', color: 'black', validMoves: { '4,2': true, '4,3': true } },
            '4,5': { name: 'pawn', color: 'black', validMoves: { '4,6': true } },
            '5,2': { name: 'pawn', color: 'black', validMoves: { '5,3': true } },
            '5,4': { name: 'pawn', color: 'black', validMoves: { '5,5': true } },
        });
    });

    test('a knight surrounded by a mix of friendly and enemy pieces', () => {
        /*
              0   1   2   3   4   5   6
          0 |   |   |   |   |   |   |   |
          1 |   |   | ♙ |   | ♟ |   |   |
          2 |   | ♟ |   |   |   | ♙ |   |
          3 |   |   |   | ♘ |   |   |   |
          4 |   | ♟ |   |   |   | ♙ |   |
          5 |   |   | ♟ |   | ♙ |   |   |
          6 |   |   |   |   |   |   |   |
        */
        const piecePositions: PiecePositions = {
            '3,3': { name: 'knight', color: 'white' },
            '1,2': { name: 'pawn', color: 'white' },
            '1,4': { name: 'pawn', color: 'black' },
            '2,1': { name: 'pawn', color: 'black' },
            '2,5': { name: 'pawn', color: 'white' },
            '4,1': { name: 'pawn', color: 'black' },
            '4,5': { name: 'pawn', color: 'white' },
            '5,2': { name: 'pawn', color: 'black' },
            '5,4': { name: 'pawn', color: 'white' },
        };
        expect(withValidMoves(piecePositions)).toEqual({
            '3,3': {
                name: 'knight',
                color: 'white',
                validMoves: {
                    '1,4': true,
                    '2,1': true,
                    '4,1': true,
                    '5,2': true,
                },
            },
            '1,2': { name: 'pawn', color: 'white', validMoves: { '1,1': true, '2,1': true } },
            '1,4': { name: 'pawn', color: 'black', validMoves: { '1,5': true, '2,5': true } },
            '2,1': {
                name: 'pawn',
                color: 'black',
                validMoves: { '1,2': true, '2,2': true, '2,3': true },
            },
            '2,5': { name: 'pawn', color: 'white', validMoves: { '1,4': true, '2,4': true } },
            '4,1': { name: 'pawn', color: 'black', validMoves: { '4,2': true, '4,3': true } },
            '4,5': { name: 'pawn', color: 'white', validMoves: { '4,4': true } },
            '5,2': { name: 'pawn', color: 'black', validMoves: { '5,3': true } },
            '5,4': { name: 'pawn', color: 'white', validMoves: { '5,3': true } },
        });
    });
});
