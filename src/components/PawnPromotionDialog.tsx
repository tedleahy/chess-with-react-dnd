import { PIECE_CHARS } from '../utils/constants';

type PawnPromotionDialogProps = {
    visible: boolean;
    onSelectPromotionPiece: (pieceName: string) => void;
};

export default function PawnPromotionDialog({ visible, onSelectPromotionPiece }: PawnPromotionDialogProps) {
    return (
        visible && (
            <dialog
                style={{
                    zIndex: 1,
                    alignSelf: 'center',
                    padding: '2rem 3rem',
                    textAlign: 'center',
                    width: '40rem',
                }}
                open
            >
                <h4 style={{ marginTop: 0 }}>Pawn Promotion!</h4>
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
            </dialog>
        )
    );
}
