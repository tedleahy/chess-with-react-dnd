let knightPosition: number[] = [0, 0];
let observer: any;

function emitChange() {
  if (observer) observer(knightPosition);
}

export function observe(o: any) {
  if (observer) throw new Error('Already observed');

  observer = o;
  emitChange();
}

export function moveKnight(toX: number, toY: number) {
  knightPosition = [toX, toY];
  emitChange();
}

export function validKnightMove(toX: number, toY: number) {
  const [x, y] = knightPosition;
  const dx = Math.abs(toX - x);
  const dy = Math.abs(toY - y);

  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}