import { Coordinate } from "../binary/coordinate";
import { Player } from "../binary/player";
import { GameOverCause } from "../binary/sessionInfo";

const store = {
    tickN: 0,
    boardSize: 32,
    gameState: {
        gameOver: false,
        gameOverCause: undefined as GameOverCause | undefined,
    },
    coords: {
        Player1: [] as Coordinate[],
        Player2: [] as Coordinate[],
    },
    food: {
        Player1: undefined as Coordinate | undefined,
        Player2: undefined as Coordinate | undefined,
    },
    debug: {
        flags: {
            "show-grid-lines":
                process.env.EXPO_PUBLIC_DEBUG_GRID_LINES === "true",
        } satisfies { [key in DebugFlag]?: boolean },
    },
};

type DebugFlag = "show-grid-lines";

export const globalS = {
    getTickN,
    setTickN,
    getBoardSize,
    setBoardSize,
    getCoords,
    setCoords,
    getFood,
    setFood,
    hasDebugFlag,
    getGameOverInfo,
    setGameOver,
} as const;

function getTickN(): number {
    return store.tickN;
}

function setTickN(tickN: number) {
    store.tickN = tickN;
}

function getBoardSize(): number {
    return store.boardSize;
}

function setBoardSize(boardSize: number) {
    store.boardSize = boardSize;
}
function getCoords(player: Player): Coordinate[] {
    return store.coords[player];
}

function setCoords(player: Player, coords: Coordinate[]) {
    store.coords[player] = coords;
}

function getFood(player: Player): Coordinate | undefined {
    return store.food[player];
}

function setFood(player: Player, coord: Coordinate) {
    store.food[player] = coord;
}

function hasDebugFlag(flag: DebugFlag): boolean {
    return store.debug.flags[flag];
}

function getGameOverInfo():
    | { gameOver: false }
    | { gameOver: true; cause: GameOverCause } {
    if (store.gameState.gameOver) {
        return { gameOver: true, cause: store.gameState.gameOverCause! };
    }

    return { gameOver: false };
}

function setGameOver(cause: GameOverCause) {
    store.gameState.gameOver = true;
    store.gameState.gameOverCause = cause;
}
