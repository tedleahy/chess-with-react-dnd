import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Board from './components/Board.tsx';
import './styles/main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Board />
  </StrictMode>,
);
