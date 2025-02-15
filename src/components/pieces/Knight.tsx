import { useDrag, DragSourceMonitor, DragPreviewImage } from 'react-dnd';
import { ItemTypes, PIECE_SIZE } from '../../constants';
import knightImage from '../../assets/unicorn.png';

interface KnightProps {
  x: number;
  y: number;
}

export default function Knight({ x, y }: KnightProps) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { x, y, name: 'knight' },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      <DragPreviewImage connect={preview} src={knightImage} />
      <div
        ref={drag as unknown as React.RefCallback<HTMLDivElement>}
        style={{
          fontSize: PIECE_SIZE,
          opacity: isDragging ? 0.4 : 1,
          fontWeight: isDragging ? 'bold' : 'normal',
          cursor: 'move',
        }}
      >
        ♘
      </div>
    </>
  );
}
