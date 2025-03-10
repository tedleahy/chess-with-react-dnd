import { useDrag, DragSourceMonitor, DragPreviewImage } from 'react-dnd';
import { ItemTypes } from '../../constants';
import knightImage from '../../assets/unicorn.png';

interface KnightProps {
  fontSize: number;
}

export default function Knight({ fontSize }: KnightProps) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.KNIGHT,
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
          fontSize: fontSize,
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
