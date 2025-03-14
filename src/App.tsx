import Board from './components/Board';
import { useState } from 'react';
import { PieceColor } from './utils/constants';

export default function App() {
    const [currentTurn, setCurrentTurn] = useState<PieceColor>('white');

    return <Board currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} />;
}
