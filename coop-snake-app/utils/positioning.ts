import { GameConstants } from "./GameConstants";
import { assert } from "./assert";

/**
 * Converts pixel value to percentage of grid size;
 * @return {number} Value between 0-100
 */
export function pixelPosToSizeIndependent(pixelPos: number): number {
  assert(
    pixelPos < GameConstants.GRID_SIZE,
    "`pixelPos` should be smaller than the size of the grid",
  );

  return (pixelPos / GameConstants.GRID_SIZE) * 100;
}
