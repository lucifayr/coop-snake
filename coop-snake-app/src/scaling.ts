import { GAME_CONSTANTS } from "./gameConstants";
import { assert } from "./assert";

/**
 * Converts pixel value to percentage of grid size;
 * @return {number} Value between 0-100
 */
export function gridPosToPixels(gridPos: number, canvasSize: number): number {
    assert(
        gridPos < GAME_CONSTANTS.GRID_SIZE,
        `gridPos should be smaller than the size of the grid. Received ${gridPos}`,
    );

    return (gridPos / GAME_CONSTANTS.GRID_SIZE) * canvasSize;
}

export function snakeSegemntSize(canvasSize: number): number {
    return (1 / GAME_CONSTANTS.GRID_SIZE) * canvasSize;
}
