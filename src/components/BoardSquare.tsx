import { PropsWithChildren } from 'react';
import Square from './Square';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { ItemTypes, ChessPiece, PieceColor, PiecePositions } from '../utils/constants';
import {
    isValidMove,
    moveWouldResultInCheck,
    setValidMovesInPiecePositions,
} from '../utils/moveValidations';
import Overlay from './Overlay';

interface BoardSquareProps {
    x: number;
    y: number;
    piecePositions: PiecePositions;
    setPiecePositions: React.Dispatch<React.SetStateAction<PiecePositions>>;
    currentPlayer: PieceColor;
    setCurrentPlayer: React.Dispatch<React.SetStateAction<PieceColor>>;
    promotedPawnPosition: string;
    setPromotedPawnPosition: React.Dispatch<React.SetStateAction<string>>;
}

export type PieceDropItem = ChessPiece & { x: number; y: number };

export default function BoardSquare({
    x,
    y,
    piecePositions,
    setPiecePositions,
    currentPlayer,
    setCurrentPlayer,
    promotedPawnPosition,
    setPromotedPawnPosition,
    children,
}: PropsWithChildren<BoardSquareProps>) {
    const color = (x + y) % 2 === 1 ? '#7a5d2b' : '#a37d53';

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: ItemTypes.PIECE,
            canDrop: (item: PieceDropItem) => {
                if (promotedPawnPosition) return false;

                const isValid =
                    currentPlayer === item.color &&
                    isValidMove([item.x, item.y], [x, y], piecePositions);

                // If the move is not valid, no need to check further
                if (!isValid) return false;

                // If it is valid, check if it would result in the player's king being in check
                return !moveWouldResultInCheck(
                    [item.x, item.y],
                    [x, y],
                    piecePositions,
                    currentPlayer,
                );
            },
            drop: (item: PieceDropItem) => {
                setPiecePositions((prev: PiecePositions) => {
                    const newPiecePositions = { ...prev };

                    // Remove the piece from its original position
                    delete newPiecePositions[`${item.x},${item.y}`];

                    // Handle pawn promotion
                    if (item.name === 'pawn' && [0, 7].includes(y)) {
                        setPromotedPawnPosition(`${x},${y}`);
                    }

                    // Add the piece to its new position
                    newPiecePositions[`${x},${y}`] = {
                        name: item.name,
                        color: item.color,
                    };

                    setValidMovesInPiecePositions(newPiecePositions);

                    return newPiecePositions;
                });

                setCurrentPlayer((prev) => (prev === 'white' ? 'black' : 'white'));
            },
            collect: (monitor: DropTargetMonitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
            }),
        }),
        [x, y, piecePositions, currentPlayer],
    );

    return (
        <div
            ref={drop as unknown as React.Ref<HTMLDivElement>}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            <Square color={color}>{children}</Square>
            {isOver && !canDrop && <Overlay color="red" />}
            {!isOver && canDrop && <Overlay color="yellow" />}
            {isOver && canDrop && <Overlay color="green" />}
        </div>
    );
}
