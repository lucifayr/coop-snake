import { assert } from "./assert";

/**
 * Converts pixel value to percentage of grid size;
 * @return {number} Value between 0-100
 */
export function gridPosToPixels(
    boardSize: number,
    gridPos: number,
    canvasSize: number,
): number {
    assert(
        gridPos < boardSize,
        `gridPos should be smaller than the size of the grid. Received ${gridPos}`,
    );

    return (gridPos / boardSize) * canvasSize;
}

export function gridCellSize(boardSize: number, canvasSize: number): number {
    return (1 / boardSize) * canvasSize;
}
