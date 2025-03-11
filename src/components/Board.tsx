import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoardSquare from './BoardSquare';
import { useEffect, useState } from 'react';
import { BOARD_SIZE, PieceColor, PiecePositions, initialPiecePositions } from '../utils/constants';
import Piece from './Piece';

type BoardProps = {
    currentTurn: PieceColor;
    setCurrentTurn: React.Dispatch<React.SetStateAction<PieceColor>>;
};

export default function Board({ currentTurn, setCurrentTurn }: BoardProps) {
    const [piecePositions, setPiecePositions] = useState<PiecePositions>(initialPiecePositions);
    const [inCheck, setInCheck] = useState<PieceColor | null>(null);

    useEffect(() => {
        for (const [, piece] of Object.entries(piecePositions)) {
            if (!piece.validMoves) continue;

            for (const [targetPosition] of Object.entries(piece.validMoves)) {
                const pieceOnSquare = piecePositions[targetPosition];
                if (pieceOnSquare?.name === 'king') {
                    setInCheck(pieceOnSquare.color);
                    return;
                }
            }
        }
    }, [piecePositions]);

    const squares = Array.from({ length: 64 }).map((_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);

        return (
            <div key={`square-${i}`} style={{ width: '12.5%', height: '12.5%' }}>
                <BoardSquare
                    x={x}
                    y={y}
                    piecePositions={piecePositions}
                    setPiecePositions={setPiecePositions}
                    currentTurn={currentTurn}
                    setCurrentTurn={setCurrentTurn}
                >
                    {getPieceComponent(piecePositions, x, y)}
                </BoardSquare>
            </div>
        );
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div
                style={{
                    width: BOARD_SIZE,
                    height: BOARD_SIZE,
                    display: 'flex',
                    flexWrap: 'wrap',
                    border: '1px solid black',
                }}
            >
                {squares}
            </div>
        </DndProvider>
    );
}

function getPieceComponent(piecePositions: PiecePositions, x: number, y: number) {
    const piece = piecePositions[`${x},${y}`];
    return piece ? <Piece x={x} y={y} name={piece.name} color={piece.color} /> : null;
}
