import { Directions } from "react-native-gesture-handler";
import { Coordinate } from "../binary/coordinate";
import { Player } from "../binary/player";
import { GameOverCause } from "../binary/sessionInfo";

const store = {
    tickN: 0,
    boardSize: 32,
    me: "Player1" as Player,
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
    me,
    getTickN,
    setTickN,
    getBoardSize,
    setBoardSize,
    getCoords,
    setCoords,
    getDirection,
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

function getDirection(player: Player): keyof typeof Directions {
    const p1 = store.coords[player][0];
    const p2 = store.coords[player][1];

    const dx = p1?.x - p2?.x;
    if (dx === 1) {
        return "RIGHT";
    }
    if (dx === -1) {
        return "LEFT";
    }

    const dy = p1?.y - p2?.y;
    if (dy === 1) {
        return "DOWN";
    }
    if (dy === -1) {
        return "UP";
    }

    // fallback
    return "RIGHT";
}

function me(): Player {
    return store.me;
}
