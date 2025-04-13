import { render, screen } from '@testing-library/react';
import Piece, { PieceProps } from '../Piece';
import { ItemTypes, PIECE_CHARS, PieceColor } from '../../utils/constants';
import { DndProvider, useDrag, DragPreviewImage } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DnDWrapper = ({ children }: { children: React.ReactNode }) => (
    <DndProvider backend={HTML5Backend}>{children}</DndProvider>
);

// Mock the react-dnd module - returns the original module with its useDrag and DragPreviewImage functions mocked
jest.mock('react-dnd', () => {
    const original = jest.requireActual('react-dnd');

    return {
        ...original,
        useDrag: jest.fn(() => [
            { isDragging: false }, // drag state
            jest.fn(), // drag ref
            jest.fn(), // preview ref
        ]),
        DragPreviewImage: jest.fn(() => null),
    };
});

// Mock the drag preview images
jest.mock('../../utils/dragPreviewImages', () => ({
    DRAG_PREVIEW_IMAGES: {
        knight: 'knight-preview-url',
        bishop: 'bishop-preview-url',
        rook: 'rook-preview-url',
        queen: 'queen-preview-url',
        king: 'king-preview-url',
        pawn: 'pawn-preview-url',
    },
}));

describe('Piece Component', () => {
    const defaultProps = { x: 0, y: 0, name: 'knight', color: 'white' as PieceColor };

    beforeEach(() => jest.clearAllMocks());

    function setup(props?: Partial<PieceProps>) {
        return render(
            <DnDWrapper>
                <Piece {...defaultProps} {...props} />
            </DnDWrapper>,
        );
    }

    test('renders the correct chess piece character', () => {
        const pieceNames = ['knight', 'bishop', 'rook', 'queen', 'king', 'pawn'];

        pieceNames.forEach((pieceName) => {
            const { unmount } = setup({ name: pieceName });

            const pieceElement = screen.getByText(PIECE_CHARS[pieceName]);
            expect(pieceElement).toBeInTheDocument();

            unmount();
        });
    });

    test('applies the correct colour to the piece', () => {
        const colors: PieceColor[] = ['white', 'black'];
        colors.forEach((color) => {
            const { unmount } = setup({ color: color });

            const pieceElement = screen.getByText(PIECE_CHARS[defaultProps.name]);
            expect(pieceElement).toHaveStyle({ color: color });

            unmount();
        });
    });

    test('sets up drag with correct item data', () => {
        const useDragMock = useDrag as jest.Mock;

        setup();

        expect(useDragMock).toHaveBeenCalled();
        // Get the value of the first arg that was passed to useDrag.
        // This is a function that returns the drag configuration
        const dragConfig = useDragMock.mock.calls[0][0]();

        expect(dragConfig.type).toBe(ItemTypes.PIECE);
        expect(dragConfig.item).toEqual({
            x: defaultProps.x,
            y: defaultProps.y,
            name: defaultProps.name,
            color: defaultProps.color,
        });
    });

    test("sets up the drag's collecting function to return whether a piece is being dragged", () => {
        const useDragMock = useDrag as jest.Mock;

        setup();

        const dragConfig = useDragMock.mock.calls[0][0]();

        const mockMonitor = {
            isDragging: jest.fn(() => true),
        };

        const resultWhenDragging = dragConfig.collect(mockMonitor);
        expect(mockMonitor.isDragging).toHaveBeenCalled();
        expect(resultWhenDragging).toEqual({ isDragging: true });

        mockMonitor.isDragging.mockReturnValue(false);
        const resultWhenNotDragging = dragConfig.collect(mockMonitor);
        expect(resultWhenNotDragging).toEqual({ isDragging: false });
    });

    test('applies opacity style when dragging', () => {
        const useDragMock = useDrag as jest.Mock;
        // Mock the piece having a state of being dragged
        useDragMock.mockImplementation(() => [{ isDragging: true }, jest.fn(), jest.fn()]);

        const wrapper = setup();

        const pieceElement = wrapper.getByText(PIECE_CHARS[defaultProps.name]);
        expect(pieceElement).toHaveStyle({ opacity: 0.4 });
    });

    ['knight', 'bishop', 'rook', 'queen', 'pawn'].forEach((pieceName) => {
        test(`uses correct preview image for ${pieceName} when dragging`, () => {
            const useDragMock = useDrag as jest.Mock;
            const dragPreviewImageMock = DragPreviewImage as jest.Mock;
            const previewConnectMock = jest.fn();

            useDragMock.mockImplementation(() => [
                { isDragging: false },
                jest.fn(),
                previewConnectMock,
            ]);

            setup({ name: pieceName });

            // Test that the DragPreviewImage was rendered
            expect(dragPreviewImageMock).toHaveBeenCalled();

            // Get the props passed to DragPreviewImage (its first argument)
            const props = dragPreviewImageMock.mock.calls[0][0];

            // Test that the connect prop is our mock function
            expect(props.connect).toBe(previewConnectMock);

            // Test that the src prop is the correct preview image URL - this is mocked at the top of the file
            expect(props.src).toBe(`${pieceName}-preview-url`);
        });
    });
});
