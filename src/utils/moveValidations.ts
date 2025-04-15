import { ChessPiece, PieceColor, PiecePositions } from './constants';

// Lookup table that maps from a possible position to whether a move there is valid
export type ValidMoves = Record<string, boolean>;

export function isValidMove(
    [currentX, currentY]: number[],
    [targetX, targetY]: number[],
    piecePositions: PiecePositions,
): boolean {
    const validMoves = piecePositions[`${currentX},${currentY}`]?.validMoves;
    if (!validMoves) return false;

    return !!validMoves[`${targetX},${targetY}`];
}

const rookDirections = [
    [-1, 0], // Left
    [1, 0], // Right
    [0, -1], // Forwards
    [0, 1], // Backwards
];

const bishopDirections = [
    [-1, -1], // Diagonally left and forward
    [1, -1], // Diagonally right and forward
    [-1, 1], // Diagonally left and backwards
    [1, 1], // Diagonally right and backwards
];

const validDirectionsForPiece: Record<string, number[][]> = {
    rook: rookDirections,
    bishop: bishopDirections,
    // A queen is effectively a combination of a rook and a bishop - it can move horizontally, vertically, or diagonally.
    queen: [...rookDirections, ...bishopDirections],
    // Same for a king in terms of the directions it can move in
    king: [...rookDirections, ...bishopDirections],
    knight: [
        [-1, -2], // 1 space left, 2 spaces forward
        [-2, -1], // 2 spaces left, 1 space forward
        [1, -2], // 1 space right, 2 spaces forward
        [2, -1], // 2 spaces right, 1 space forward
        [-1, 2], // 1 space left, 2 spaces backwards
        [-2, 1], // 2 spaces left, 1 space backwards
        [1, 2], // 1 space right, 2 spaces backwards
        [2, 1], // 2 spaces right, 1 space backwards
    ],
    pawn: [
        [0, 1], // 1 space forward
        [0, 2], // 2 spaces forward (on its first move)
        [-1, 1], // Diagonally forwards and left (when capturing)
        [1, 1], // Diagonally forwards and right (when capturing)
    ],
};

function withinBoardBounds(x: number, y: number) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
}

export function getValidMoves(
    x: number,
    y: number,
    pieceName: string,
    color: PieceColor,
    piecePositions: PiecePositions,
): ValidMoves {
    if (pieceName === 'pawn') return getValidPawnMoves(x, y, color, piecePositions);

    const directions = validDirectionsForPiece[`${pieceName}`];
    const validMoves: ValidMoves = {};

    for (const [dx, dy] of directions) {
        let currentX = x + dx;
        let currentY = y + dy;

        while (withinBoardBounds(currentX, currentY)) {
            if (squareContainsSameColorPiece(currentX, currentY, color, piecePositions)) {
                break;
            }

            validMoves[`${currentX},${currentY}`] = true;

            // If we encounter an opponent's piece, we can capture it but can't go further
            const pieceOnSquare = piecePositions[`${currentX},${currentY}`];
            if (pieceOnSquare && pieceOnSquare.color !== color) {
                break;
            }

            // Knights and kings can only move once in a given direction, so break after the first iteration
            if (pieceName === 'knight' || pieceName === 'king') break;

            currentX += dx;
            currentY += dy;
        }
    }

    return validMoves;
}

// Pawns have quite specific logic to how they move under different conditions, so they get their
// own special function
function getValidPawnMoves(
    x: number,
    y: number,
    color: PieceColor,
    piecePositions: PiecePositions,
): ValidMoves {
    const directions = validDirectionsForPiece.pawn;
    const isFirstMove = color === 'black' ? y === 1 : y === 6;

    const validMoves: ValidMoves = {};

    for (const [dx, dy] of directions) {
        const currentX = x + dx;
        const currentY = color === 'black' ? y + dy : y - dy;

        // Prevent moving off the board
        if (!withinBoardBounds(currentX, currentY)) continue;
        // Prevent moving onto a square that contains a piece of the same colour
        if (squareContainsSameColorPiece(currentX, currentY, color, piecePositions)) continue;
        // Prevent moving 2 squares forward unless it's this pawn's first move
        if (dy === 2 && !isFirstMove) continue;

        const pieceOnSquare = piecePositions[`${currentX},${currentY}`];
        // Prevent diagonal moves unless there's another piece in that square (i.e. it's capturing)
        if (dx !== 0 && !pieceOnSquare) continue;
        // Prevent moving forward if there's an opponent's piece in that square - pawns can only capture diagonally
        if (dx === 0 && pieceOnSquare) continue;

        validMoves[`${currentX},${currentY}`] = true;
    }

    return validMoves;
}

function squareContainsSameColorPiece(
    x: number,
    y: number,
    color: PieceColor,
    piecePositions: PiecePositions,
) {
    const pieceOnSquare = piecePositions[`${x},${y}`];
    return pieceOnSquare && pieceOnSquare.color === color;
}

// For each piece, calculate all the valid moves it can make, and update its valid moves in piecePositions
export function setValidMovesInPiecePositions(piecePositions: PiecePositions) {
    for (const [position, piece] of Object.entries(piecePositions)) {
        const [x, y] = position.split(',').map(Number);
        piece.validMoves = getValidMoves(x, y, piece.name, piece.color, piecePositions);
    }
}

// Check if a move would result in the player's king being in check
export function moveWouldResultInCheck(
    [currentX, currentY]: number[],
    [targetX, targetY]: number[],
    piecePositions: PiecePositions,
    currentTurn: PieceColor,
): boolean {
    // Create a deep copy of the piece positions to simulate the move
    const simulatedPositions: PiecePositions = JSON.parse(JSON.stringify(piecePositions));

    // Get the piece that would be moved
    const movingPiece = simulatedPositions[`${currentX},${currentY}`];
    if (!movingPiece) return false;

    // Remove the piece from its original position
    delete simulatedPositions[`${currentX},${currentY}`];

    // Add the piece to its new position
    simulatedPositions[`${targetX},${targetY}`] = movingPiece;

    // Recalculate valid moves for all pieces in the simulated new positions
    setValidMovesInPiecePositions(simulatedPositions);

    // Find the king of the current player
    let kingPosition = '';
    for (const [position, piece] of Object.entries(simulatedPositions)) {
        if (piece.name === 'king' && piece.color === currentTurn) {
            kingPosition = position;
            break;
        }
    }

    // Check if any opponent's piece can capture the king in the simulated position
    for (const piece of Object.values(simulatedPositions)) {
        if (piece.color !== currentTurn && piece.validMoves) {
            if (piece.validMoves[kingPosition]) {
                return true; // The move would result in check
            }
        }
    }

    return false; // The move is safe
}

export function isCheckmate(piecePositions: PiecePositions, currentPlayer: PieceColor): boolean {
    // Find the king's position
    let kingPosition = '';
    for (const [position, piece] of Object.entries(piecePositions)) {
        if (piece.name === 'king' && piece.color === currentPlayer) {
            kingPosition = position;
            break;
        }
    }

    // Get any pieces attacking the king
    const attackingPieces: Array<[string, ChessPiece]> = [];
    for (const [position, piece] of Object.entries(piecePositions)) {
        if (piece.color !== currentPlayer && piece.validMoves?.[kingPosition]) {
            attackingPieces.push([position, piece]);
        }
    }

    // If there are no attacking pieces, it's not even check, let alone checkmate
    if (attackingPieces.length === 0) return false;

    const king = piecePositions[kingPosition];

    if (attackingPieces.length > 1) {
        // If the king can't move, and there's more than one attacking piece, it's
        // checkmate - it's impossible to block or capture multiple attacking pieces at once
        if (attackingPieces.length > 1 && !king.validMoves) return true;

        // If the king can move out of check, then it's not checkmate
        if (kingCanMoveOutOfCheck(kingPosition, king, piecePositions, currentPlayer)) {
            return false;
        }
    }

    // If there's only a single attacking piece, a player has three escape options:
    //  1. Move the king to a safe square
    //  2. Capture the attacking piece
    //  3. Block the attack
    // If they can't do any of these things, it's checkmate

    // Check if any piece can capture the attacker
    const [attackerPosition, attacker] = attackingPieces[0];

    for (const piece of Object.values(piecePositions)) {
        if (piece.color !== currentPlayer) continue; // skip opponent's pieces

        // If this piece can capture the attacking piece, it's not checkmate
        if (piece.validMoves?.[attackerPosition]) {
            return false;
        }
    }

    // Check if the attacking piece can be blocked
    if (['bishop', 'rook', 'queen'].includes(attacker.name)) {
        const blockingSquares = getSquaresBetween(attackerPosition, kingPosition);

        // Check if any piece can move to a blocking square
        for (const [position, piece] of Object.entries(piecePositions)) {
            if (piece.color !== currentPlayer) continue; // skip opponent's pieces
            if (piece.name === 'king') continue; // king can't block itself

            const [pieceX, pieceY] = position.split(',').map(Number);

            for (const blockingSquare of blockingSquares) {
                if (piece.validMoves?.[blockingSquare]) {
                    const [blockX, blockY] = blockingSquare.split(',').map(Number);

                    const moveWouldEndCheck = !moveWouldResultInCheck(
                        [pieceX, pieceY],
                        [blockX, blockY],
                        piecePositions,
                        currentPlayer,
                    );

                    // The attack can be blocked, so it's not checkmate
                    if (moveWouldEndCheck) return false;
                }
            }
        }
    }

    // If we've checked all the possible defenses and none work, it's checkmate
    return true;
}

function kingCanMoveOutOfCheck(
    kingPosition: string,
    king: ChessPiece,
    piecePositions: PiecePositions,
    currentPlayer: PieceColor,
) {
    for (const movePosition of Object.keys(king.validMoves || {})) {
        const [kingX, kingY] = kingPosition.split(',').map(Number);
        const [moveX, moveY] = movePosition.split(',').map(Number);
        const validMoveOutOfCheck = !moveWouldResultInCheck(
            [kingX, kingY],
            [moveX, moveY],
            piecePositions,
            currentPlayer,
        );

        if (validMoveOutOfCheck) return true;
    }

    return false;
}

// Gets the positions of all squares between two positions.
// Figures out the direction based on where each piece is in relation to each other.
// Returns an empty array if there is no way for a piece to get from one position to the other.
function getSquaresBetween(startPosition: string, endPosition: string): string[] {
    const [startX, startY] = startPosition.split(',').map(Number);
    const [endX, endY] = endPosition.split(',').map(Number);

    const squares: string[] = [];

    // Horizontal
    if (startY === endY) {
        const start = Math.min(startX, endX) + 1;
        const end = Math.max(startX, endX);
        for (let x = start; x < end; x++) {
            squares.push(`${x},${startY}`);
        }
    }
    // Vertical
    else if (startX === endX) {
        const start = Math.min(startY, endY) + 1;
        const end = Math.max(startY, endY);
        for (let y = start; y < end; y++) {
            squares.push(`${startX},${y}`);
        }
    }
    // Diagonal - if the number of squares moved horizontally is the same as
    // the number of squares moved vertically
    else if (Math.abs(endX - startX) === Math.abs(endY - startY)) {
        // Figure out if going up or down the board
        const xStep = endX > startX ? 1 : -1;
        const yStep = endY > startY ? 1 : -1;

        let x = startX + xStep;
        let y = startY + yStep;

        // Until the target square is reached:
        while (x !== endX && y !== endY) {
            squares.push(`${x},${y}`);
            x += xStep;
            y += yStep;
        }
    }

    return squares;
}
