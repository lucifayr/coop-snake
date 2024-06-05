import { assert } from "./assert";
import { globalS } from "./stores/globalStore";

/**
 * Converts pixel value to percentage of grid size;
 * @return {number} Value between 0-100
 */
export function gridPosToPixels(gridPos: number, canvasSize: number): number {
    assert(
        gridPos < globalS.getBoardSize(),
        `gridPos should be smaller than the size of the grid. Received ${gridPos}`,
    );

    return (gridPos / globalS.getBoardSize()) * canvasSize;
}

export function gridCellSize(canvasSize: number): number {
    return (1 / globalS.getBoardSize()) * canvasSize;
}
