import Board from './components/Board';
import { useState } from 'react';
import { BOARD_SIZE, PieceColor } from './utils/constants';

export default function App() {
    const [currentTurn, setCurrentTurn] = useState<PieceColor>('white');

    return (
        <div style={{ width: BOARD_SIZE }}>
            <Board currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} />

            <p style={{ textAlign: 'center', color: 'white', fontFamily: 'sans-serif' }}>
                Current turn: <b>{currentTurn}</b>
            </p>
        </div>
    );
}
