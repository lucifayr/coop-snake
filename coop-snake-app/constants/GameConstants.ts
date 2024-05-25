export enum GameConstants {
  GRID_SIZE = 17,
  CELL_SIZE = 20,
}

export enum SnakeBodyDirection {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
  // UPLEFT = 4,
  // UPRIGHT = 5,
  // DOWNLEFT = 6,
  // DOWNRIGHT = 7,
}

export function translateRotation(rotation: SnakeBodyDirection) {
  switch (rotation) {
    case SnakeBodyDirection.UP:
      return 0;
    case SnakeBodyDirection.DOWN:
      return 180;
    case SnakeBodyDirection.LEFT:
      return 270;
    case SnakeBodyDirection.RIGHT:
      return 90;
  }
}
