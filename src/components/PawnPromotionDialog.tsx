import { PIECE_CHARS } from '../utils/constants';
import Dialog from './Dialog';

type PawnPromotionDialogProps = {
    open: boolean;
    onSelectPromotionPiece: (pieceName: string) => void;
};

export default function PawnPromotionDialog({
    open,
    onSelectPromotionPiece,
}: PawnPromotionDialogProps) {
    return (
        <Dialog open={open} header="Pawn Promotion!">
            <p>
                Congratulations, your humble pawn is being promoted.
                <br />
                Please select the piece you would like to promote it to.
            </p>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '1rem 2rem',
                }}
            >
                {Object.entries(PIECE_CHARS).map(([name, icon]) => {
                    return (
                        !['king', 'pawn'].includes(name) && (
                            <button
                                key={name}
                                style={{ fontSize: '6rem' }}
                                onClick={() => onSelectPromotionPiece(name)}
                            >
                                {icon}
                            </button>
                        )
                    );
                })}
            </div>
        </Dialog>
    );
}
