import { useDrag, DragSourceMonitor, DragPreviewImage } from 'react-dnd';
import {
    DRAG_PREVIEW_IMAGES,
    ItemTypes,
    PIECE_CHARS,
    PIECE_SIZE,
    PieceColor,
} from '../utils/constants';

interface PieceProps {
    x: number;
    y: number;
    name: string;
    color: PieceColor;
}

export default function Piece({ x, y, name, color }: PieceProps) {
    const dragPreviewImg = DRAG_PREVIEW_IMAGES[name];

    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: ItemTypes.PIECE,
            item: { x, y, name, color },
            collect: (monitor: DragSourceMonitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [x, y, name, color],
    );

    return (
        <>
            {dragPreviewImg && <DragPreviewImage connect={preview} src={dragPreviewImg} />}
            <div
                ref={drag as unknown as React.RefCallback<HTMLDivElement>}
                style={{
                    fontSize: PIECE_SIZE,
                    color: color,
                    opacity: isDragging ? 0.4 : 1,
                    fontWeight: 'bold',
                    cursor: 'move',
                }}
            >
                {PIECE_CHARS[name]}
            </div>
        </>
    );
}
