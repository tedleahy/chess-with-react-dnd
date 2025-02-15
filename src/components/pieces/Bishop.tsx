import { DragSourceMonitor, useDrag } from 'react-dnd';
import { ItemTypes } from '../../constants';

interface BishopProps {
  fontSize: number;
  x: number;
  y: number;
}

export default function Bishop({ fontSize, x, y }: BishopProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { x, y, name: 'bishop' },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      <div
        ref={drag as unknown as React.RefCallback<HTMLDivElement>}
        style={{
          fontSize,
          opacity: isDragging ? 0.4 : 1,
          fontWeight: isDragging ? 'bold' : 'normal',
          cursor: 'move',
        }}
      >
        ♗
      </div>
    </>
  );
}
