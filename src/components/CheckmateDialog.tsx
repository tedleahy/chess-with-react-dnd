import { PIECE_CHARS, PieceColor } from '../utils/constants';
import Dialog from './Dialog';

type CheckmateDialogProps = {
    open: boolean;
    currentPlayer: PieceColor;
    onAccept: () => void;
};

export default function CheckmateDialog({ open, currentPlayer, onAccept }: CheckmateDialogProps) {
    const winner = currentPlayer === 'black' ? 'White' : 'Black';

    return (
        <Dialog open={open} header="Checkmate!" backgroundColor="#fba5f4">
            <p>
                The winner is... <strong>{winner}</strong>!
            </p>
            <p style={{ fontSize: '4rem', margin: 0 }}>
                🎉
                <span
                    style={{
                        fontSize: '6rem',
                        lineHeight: '4rem',
                        padding: '0 0.5rem',
                        color: winner.toLowerCase(),
                    }}
                >
                    {PIECE_CHARS.king}
                </span>
                🎉
            </p>

            <button
                style={{
                    backgroundColor: '#24a0ed',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
                onClick={onAccept}
            >
                Play again
            </button>
        </Dialog>
    );
}
