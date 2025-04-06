import { fireEvent, render, screen } from '@testing-library/react';
import PawnPromotionDialog from '../PawnPromotionDialog';
import { PIECE_CHARS } from '../../utils/constants';
import { assertAccessible } from '../../test-utils/accessibility';

describe('PawnPromotionDialog Component', () => {
    test('Is visible when the open prop is true', () => {
        render(<PawnPromotionDialog open={true} onSelectPromotionPiece={() => {}} />);

        expect(screen.getByText('Pawn Promotion!')).toBeVisible();
        expect(screen.getByText(/your humble pawn is being promoted/)).toBeVisible();
    });

    test('Is not visible when the open prop is false', () => {
        render(<PawnPromotionDialog open={false} onSelectPromotionPiece={() => {}} />);

        expect(screen.getByText('Pawn Promotion!')).not.toBeVisible();
        expect(screen.getByText(/your humble pawn is being promoted/)).not.toBeVisible();
    });

    test('Displays only valid promotion pieces (no king or pawn)', () => {
        render(<PawnPromotionDialog open={true} onSelectPromotionPiece={() => {}} />);

        // Check valid pieces are present
        for (const validPiece of ['queen', 'rook', 'bishop', 'knight']) {
            const pieceChar = PIECE_CHARS[validPiece];
            expect(screen.getByRole('button', { name: pieceChar })).toBeInTheDocument();
        }

        // Check invalid pieces are not present
        for (const invalidPiece of ['king', 'pawn']) {
            const pieceChar = PIECE_CHARS[invalidPiece];
            expect(screen.queryByRole('button', { name: pieceChar })).not.toBeInTheDocument();
        }
    });

    describe('Promotion piece selection', () => {
        const mockOnSelect = jest.fn();

        beforeEach(() => {
            // Reset mock before each test
            mockOnSelect.mockClear();
            render(<PawnPromotionDialog open={true} onSelectPromotionPiece={mockOnSelect} />);
        });

        for (const piece of ['queen', 'rook', 'bishop', 'knight']) {
            test(`calls onSelectPromotionPiece with "${piece}" when ${piece} is clicked`, () => {
                fireEvent.click(screen.getByRole('button', { name: PIECE_CHARS[piece] }));

                expect(mockOnSelect).toHaveBeenCalledTimes(1);
                expect(mockOnSelect).toHaveBeenCalledWith(piece);
            });
        }
    });

    test('Should have no accessibility violations', async () => {
        assertAccessible(<PawnPromotionDialog open={true} onSelectPromotionPiece={() => {}} />);
    });
});
