export function validKnightMove(toX: number, toY: number, fromX: number, fromY: number) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);

  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}