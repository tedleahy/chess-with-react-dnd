import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { observe } from './utils.ts';
import Board from './components/Board.tsx';

const root = createRoot(document.getElementById('root')!);

observe((knightPosition: number[]) => {
  root.render(
    <StrictMode>
      <Board boardSize={800} knightPosition={knightPosition} />
    </StrictMode>,
  );
});
