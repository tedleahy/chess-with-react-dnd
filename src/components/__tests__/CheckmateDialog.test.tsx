import { fireEvent, render, screen } from '@testing-library/react';
import CheckmateDialog from '../CheckmateDialog';
import { PIECE_CHARS, PieceColor } from '../../utils/constants';

describe('CheckmateDialog Component', () => {
    function setup(open: boolean, currentPlayer: PieceColor = 'white', onAccept = () => {}) {
        render(<CheckmateDialog open={open} currentPlayer={currentPlayer} onAccept={onAccept} />);
    }

    test('Is visible when the "open" prop is true', () => {
        setup(true);
        expect(screen.getByText('Checkmate!')).toBeVisible();
    });

    test('Is not visible when the "open" prop is false', () => {
        setup(false);

        expect(screen.getByText('Checkmate!')).not.toBeVisible();
    });

    describe('Displays the correct winner', () => {
        test('Displays the winner as black if the current player is white', () => {
            setup(true, 'white');
            const winnerParagraph = screen.getByText(/The winner is/);
            expect(winnerParagraph).toHaveTextContent('Black');

            const kingSpan = screen.getByText(PIECE_CHARS.king);
            expect(kingSpan).toHaveStyle({ color: 'black' });
        });

        test('Displays the winner as white if the current player is black', () => {
            setup(true, 'black');
            const winnerParagraph = screen.getByText(/The winner is/);
            expect(winnerParagraph).toHaveTextContent('White');

            const kingSpan = screen.getByText(PIECE_CHARS.king);
            expect(kingSpan).toHaveStyle({ color: 'white' });
        });
    });

    describe('Clicking the Play Again button', () => {
        test('calls onAccept once', () => {
            const mockOnAccept = jest.fn();
            setup(true, 'black', mockOnAccept);

            fireEvent.click(screen.getByRole('button', { name: 'Play again' }));
            expect(mockOnAccept).toHaveBeenCalledTimes(1);
        });
    });
});
