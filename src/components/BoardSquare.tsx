import { PropsWithChildren } from 'react';
import Square from './Square';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { ItemTypes, Piece, PieceColor, PiecePositions } from '../utils/constants';
import { isValidMove, setValidMovesInPiecePositions } from '../utils/moveValidations';
import Overlay from './Overlay';

interface BoardSquareProps {
    x: number;
    y: number;
    piecePositions: PiecePositions;
    setPiecePositions: React.Dispatch<React.SetStateAction<PiecePositions>>;
    currentTurn: PieceColor;
    setCurrentTurn: React.Dispatch<React.SetStateAction<PieceColor>>;
}

export type PieceDropItem = Piece & { x: number; y: number };

export default function BoardSquare({
    x,
    y,
    piecePositions,
    setPiecePositions,
    children,
    currentTurn,
    setCurrentTurn,
}: PropsWithChildren<BoardSquareProps>) {
    const color = (x + y) % 2 === 1 ? '#b58863' : '#f0d9b5';

    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: ItemTypes.PIECE,
            canDrop: (item: PieceDropItem) =>
                currentTurn === item.color && isValidMove([item.x, item.y], [x, y], piecePositions),
            drop: (item: PieceDropItem) => {
                setPiecePositions((prev: PiecePositions) => {
                    const newPiecePositions = { ...prev };

                    // Remove the piece from its original position
                    delete newPiecePositions[`${item.x},${item.y}`];

                    // Add the piece to its new position
                    newPiecePositions[`${x},${y}`] = {
                        name: item.name,
                        color: item.color,
                    };

                    setValidMovesInPiecePositions(newPiecePositions);

                    return newPiecePositions;
                });

                setCurrentTurn((prev) => (prev === 'white' ? 'black' : 'white'));
            },
            collect: (monitor: DropTargetMonitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
            }),
        }),
        [x, y, piecePositions],
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
