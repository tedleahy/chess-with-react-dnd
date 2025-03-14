import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Board from './components/Board.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Board />
  </StrictMode>,
);
