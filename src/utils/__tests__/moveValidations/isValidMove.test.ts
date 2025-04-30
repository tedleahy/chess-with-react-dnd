import { isValidMove } from '../../moveValidations';
import { PiecePositions } from '../../constants';

describe('moveUtils - isValidMove function', () => {
    test('when the piece has no valid moves', () => {
        const piecePositions: PiecePositions = {
            '0,0': { name: 'pawn', color: 'black', validMoves: {} },
        };

        expect(isValidMove([0, 0], [0, 1], piecePositions)).toBe(false);
    });

    test("when the move is not in the piece's validMoves", () => {
        const piecePositions: PiecePositions = {
            '0,0': { name: 'pawn', color: 'black', validMoves: { '0,2': true } },
        };

        expect(isValidMove([0, 0], [0, 1], piecePositions)).toBe(false);
    });

    test("when the move is in the piece's validMoves", () => {
        const piecePositions: PiecePositions = {
            '0,0': { name: 'pawn', color: 'black', validMoves: { '0,1': true } },
        };

        expect(isValidMove([0, 0], [0, 1], piecePositions)).toBe(true);
    });
});
