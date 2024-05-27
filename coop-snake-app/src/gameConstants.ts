export const GAME_CONSTANTS = {
    GRID_SIZE: 40, // TODO: too big
} as const;

export type SnakeBodyDirection = "UP" | "RIGHT" | "DOWN" | "LEFT";

export function translateRotation(rotation: SnakeBodyDirection) {
    switch (rotation) {
        case "UP":
            return 0;
        case "DOWN":
            return 180;
        case "LEFT":
            return 270;
        case "RIGHT":
            return 90;
    }
}
