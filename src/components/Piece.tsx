import { useDrag, DragSourceMonitor, DragPreviewImage } from 'react-dnd';
import { DRAG_PREVIEW_IMAGES, ItemTypes, PIECE_CHARS, PIECE_SIZE } from '../utils/constants';

interface PieceProps {
  x: number;
  y: number;
  name: string;
}

export default function Piece({ x, y, name }: PieceProps) {
  const dragPreviewImg = DRAG_PREVIEW_IMAGES[name];

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { x, y, name },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      {dragPreviewImg && <DragPreviewImage connect={preview} src={dragPreviewImg} />}
      <div
        ref={drag as unknown as React.RefCallback<HTMLDivElement>}
        style={{
          fontSize: PIECE_SIZE,
          opacity: isDragging ? 0.4 : 1,
          fontWeight: isDragging ? 'bold' : 'normal',
          cursor: 'move',
        }}
      >
        {PIECE_CHARS[name]}
      </div>
    </>
  );
}
