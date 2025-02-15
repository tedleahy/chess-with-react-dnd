function validKnightMove([fromX, fromY]: number[], [toX, toY]: number[]) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);

  // Knights must move by 2 in one axis and 1 in the other
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

function validBishopMove([fromX, fromY]: number[], [toX, toY]: number[]) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);

  // A bishop moves diagonally, so the absolute change in x and y must be equal,
  // i.e. if it moves one square up/down, it must also move one square left/right.
  // It must also move at least one square.
  return dx === dy && dx > 0;
}

export function validMove(from: number[], to: number[], piece: string) {
  switch (piece) {
    case 'knight':
      return validKnightMove(from, to);
    case 'bishop':
      return validBishopMove(from, to);
    default:
      return false;
  }
}