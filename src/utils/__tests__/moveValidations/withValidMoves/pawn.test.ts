import { PiecePositions } from '../../../constants';
import { withValidMoves } from '../../../moveValidations';

describe('withValidMoves - pawns', () => {
    test('a pawn with two clear spaces in front of it on its first move', () => {
        /*
            |   | <- position 0,0
            | ♟ | <- position 0,1 (black)
            |   | <- position 0,2
            |   | <- position 0,3
        */
        const piecePositions: PiecePositions = {
            '0,1': { name: 'pawn', color: 'black' },
        };

        expect(withValidMoves(piecePositions)).toEqual({
            '0,1': {
                name: 'pawn',
                color: 'black',
                validMoves: { '0,2': true, '0,3': true },
            },
        });
    });

    test('a pawn with two clear spaces in front of it on its second move', () => {
        /*
            |   | <- position 0,0
            |   | <- position 0,1
            | ♟ | <- position 0,2 (black)
            |   | <- position 0,3
            |   | <- position 0,4
        */
        const piecePositions: PiecePositions = {
            '0,2': { name: 'pawn', color: 'black' },
        };

        expect(withValidMoves(piecePositions)).toEqual({
            '0,2': {
                name: 'pawn',
                color: 'black',
                validMoves: { '0,3': true }, // move forward one space
            },
        });
    });

    test('a pawn with a piece of the same color in front of it', () => {
        /*
            |   | <- position 0,0
            | ♟ | <- position 0,1 (black)
            | ♟ | <- position 0,2 (black)
            |   | <- position 0,3
        */
        const piecePositions: PiecePositions = {
            '0,1': { name: 'pawn', color: 'black' },
            '0,2': { name: 'pawn', color: 'black' },
        };

        expect(withValidMoves(piecePositions)).toEqual({
            '0,1': {
                name: 'pawn',
                color: 'black',
                validMoves: {},
            },
            '0,2': {
                name: 'pawn',
                color: 'black',
                validMoves: { '0,3': true }, // move forward one space
            },
        });
    });

    test('a pawn with a piece of a different color in front of it', () => {
        /*
            |   | <- position 0,0
            | ♟ | <- position 0,1 (black)
            | ♟ | <- position 0,2 (white)
            |   | <- position 0,3
        */
        const piecePositions: PiecePositions = {
            '0,1': { name: 'pawn', color: 'black' },
            '0,2': { name: 'pawn', color: 'white' },
        };

        expect(withValidMoves(piecePositions)).toEqual({
            '0,1': {
                name: 'pawn',
                color: 'black',
                validMoves: {},
            },
            '0,2': {
                name: 'pawn',
                color: 'white',
                validMoves: {},
            },
        });
    });

    test('two different-colored pawns with only one clear space between them', () => {
        /*
            |   | <- position 0,0
            | ♟ | <- position 0,1 (black)
            |   | <- position 0,2
            | ♟ | <- position 0,3 (white)
        */
        const piecePositions: PiecePositions = {
            '0,1': { name: 'pawn', color: 'black' },
            '0,3': { name: 'pawn', color: 'white' },
        };

        expect(withValidMoves(piecePositions)).toEqual({
            '0,1': {
                name: 'pawn',
                color: 'black',
                validMoves: { '0,2': true }, // move forward one space
            },
            '0,3': {
                name: 'pawn',
                color: 'white',
                validMoves: { '0,2': true }, // move forward one space
            },
        });
    });

    test('two different-colored pawns, diagonal from each other', () => {
        /*
            |   |   | <- position 0,0
            | ♟ |   | <- position 0,1 (black)
            |   | ♟ | <- position 1,2 (white)
        */
        const piecePositions: PiecePositions = {
            '0,1': { name: 'pawn', color: 'black' },
            '1,2': { name: 'pawn', color: 'white' },
        };

        expect(withValidMoves(piecePositions)).toEqual({
            '0,1': {
                name: 'pawn',
                color: 'black',
                validMoves: {
                    '0,2': true, // move forward one space
                    '0,3': true, // move forward two spaces
                    '1,2': true, // capture the other pawn
                },
            },
            '1,2': {
                name: 'pawn',
                color: 'white',
                validMoves: {
                    '0,1': true, // move forward one space
                    '1,1': true, // capture the other pawn
                },
            },
        });
    });

    test('two pawns of the same color, diagonal from each other', () => {
        /*
            |   |   | <- position 0,0
            | ♟ |   | <- position 0,1 (black)
            |   | ♟ | <- position 1,2 (black)
        */
        const piecePositions: PiecePositions = {
            '0,1': { name: 'pawn', color: 'black' },
            '1,2': { name: 'pawn', color: 'black' },
        };

        expect(withValidMoves(piecePositions)).toEqual({
            '0,1': {
                name: 'pawn',
                color: 'black',
                // can move forward 1-2 spaces, but can't capture the other pawn
                validMoves: { '0,2': true, '0,3': true },
            },
            '1,2': {
                name: 'pawn',
                color: 'black',
                // can move forward one space
                validMoves: { '1,3': true },
            },
        });
    });
});
