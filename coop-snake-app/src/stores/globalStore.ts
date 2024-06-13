import { Directions } from "react-native-gesture-handler";
import { Coordinate } from "../binary/coordinate";
import { GameOverCause } from "../binary/sessionInfo";

// Internal store with default values
const store = {
    tickN: 0,
    boardSize: 32,
    playerCount: 2,
    sessionKey: undefined as string | undefined,
    me: 1,
    gameState: {
        gameOver: false,
        gameOverCause: undefined as GameOverCause | undefined,
    },
    coords: new Map<number, Coordinate[]>(),
    food: new Map<number, Coordinate>(),
    debug: {
        flags: {
            "show-grid-lines":
                process.env.EXPO_PUBLIC_DEBUG_GRID_LINES === "true",
        } satisfies { [key in DebugFlag]?: boolean },
    },
};

type DebugFlag = "show-grid-lines";

export const globalData = {
    me,
    setMe,
    getTickN,
    setTickN,
    getBoardSize,
    setBoardSize,
    getPlayerCount,
    setPlayerCount,
    getCoords,
    setCoords,
    getDirection,
    getFood,
    setFood,
    hasDebugFlag,
    getGameOverInfo,
    setGameOver,
    getSessionKey,
    setSessionKey,
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

function getPlayerCount(): number {
    return store.playerCount;
}

function setPlayerCount(count: number) {
    store.playerCount = count;
}

function getCoords(player: number): Coordinate[] | undefined {
    return store.coords.get(player);
}

function setCoords(player: number, coords: Coordinate[]) {
    store.coords.set(player, coords);
}

function getFood(player: number): Coordinate | undefined {
    return store.food.get(player);
}

function setFood(player: number, coord: Coordinate) {
    store.food.set(player, coord);
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

function getDirection(player: number): keyof typeof Directions {
    const coords = store.coords.get(player);
    if (!coords) {
        return "RIGHT";
    }

    const p1 = coords[0];
    const p2 = coords[1];

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

function me(): number {
    return store.me;
}

function setMe(me: number) {
    store.me = me;
}

function getSessionKey(): string | undefined {
    return store.sessionKey;
}

function setSessionKey(sessionKey: string | undefined) {
    store.sessionKey = sessionKey;
}
