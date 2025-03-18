import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoardSquare from './BoardSquare';
import { useEffect, useState } from 'react';
import { BOARD_SIZE, PieceColor, PiecePositions, initialPiecePositions } from '../utils/constants';
import Piece from './Piece';
import Overlay from './Overlay';
import PawnPromotionDialog from './PawnPromotionDialog';
import { isCheckmate } from '../utils/moveValidations';

type BoardProps = {
    currentPlayer: PieceColor;
    setCurrentPlayer: React.Dispatch<React.SetStateAction<PieceColor>>;
};

export default function Board({ currentPlayer, setCurrentPlayer }: BoardProps) {
    const [piecePositions, setPiecePositions] = useState<PiecePositions>(initialPiecePositions);
    const [inCheck, setInCheck] = useState<PieceColor | null>(null);
    const [checkmate, setCheckmate] = useState(false);
    const [promotedPawnPosition, setPromotedPawnPosition] = useState('');

    useEffect(() => {
        setCheckmate(isCheckmate(piecePositions, currentPlayer));

        let kingInCheck = null;

        for (const [, piece] of Object.entries(piecePositions)) {
            if (!piece.validMoves) continue;

            // Check if any valid move would capture a king - if so, he's in check!
            for (const [targetPosition] of Object.entries(piece.validMoves)) {
                const capturablePiece = piecePositions[targetPosition];
                if (capturablePiece?.name === 'king') {
                    kingInCheck = capturablePiece.color;
                    break;
                }
            }

            // If we've already found a way that a king is in check, no need to keep looking
            if (kingInCheck) break;
        }

        setInCheck(kingInCheck);
    }, [piecePositions]);

    const squares = Array.from({ length: 64 }).map((_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const piece = piecePositions[`${x},${y}`];

        return (
            <div key={`square-${i}`} style={{ width: '12.5%', height: '12.5%' }}>
                <BoardSquare
                    x={x}
                    y={y}
                    piecePositions={piecePositions}
                    setPiecePositions={setPiecePositions}
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}
                    promotedPawnPosition={promotedPawnPosition}
                    setPromotedPawnPosition={setPromotedPawnPosition}
                >
                    {getPieceComponent(piecePositions, x, y)}
                    {piece?.name === 'king' && inCheck === piece?.color && <Overlay color="red" />}
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
                <PawnPromotionDialog
                    open={!!promotedPawnPosition}
                    onSelectPromotionPiece={(pieceName) => {
                        setPiecePositions((prev: PiecePositions) => {
                            const newPiecePositions = { ...prev };

                            newPiecePositions[promotedPawnPosition] = {
                                name: pieceName,
                                color: currentPlayer == 'white' ? 'black' : 'white',
                            };
                            return newPiecePositions;
                        });

                        setPromotedPawnPosition('');
                    }}
                />
                {squares}
            </div>
        </DndProvider>
    );
}

function getPieceComponent(piecePositions: PiecePositions, x: number, y: number) {
    const piece = piecePositions[`${x},${y}`];
    return piece ? <Piece x={x} y={y} name={piece.name} color={piece.color} /> : null;
}
