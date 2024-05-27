import { GAME_CONSTANTS } from "./gameConstants";
import { assert } from "./assert";

/**
 * Converts pixel value to percentage of grid size;
 * @return {number} Value between 0-100
 */
export function pixelPosToSizeIndependent(pixelPos: number): number {
    assert(
        pixelPos < GAME_CONSTANTS.GRID_SIZE,
        "`pixelPos` should be smaller than the size of the grid",
    );

    return (pixelPos / GAME_CONSTANTS.GRID_SIZE) * 100;
}

export function snakeSegemntSize(): number {
    return (1 / GAME_CONSTANTS.GRID_SIZE) * 100;
}
