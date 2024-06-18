import { Directions } from "react-native-gesture-handler";
import { Coordinate } from "../binary/coordinate";
import { GameOverCause } from "../binary/sessionInfo";
import { snakeSegmentDir } from "../binary/utils";
import { ReactNode, createContext, useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";

export type GameContextApi = ReturnType<typeof initContext>;
export type SnakeDirection = keyof typeof Directions;

type DebugFlag = "show-grid-lines";

const defaultValus = {
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

export const GameContext = createContext<GameContextApi>(undefined as any); // :)
export function GameContextProvider({
    children,
    sessionKey,
}: {
    children: ReactNode;
    sessionKey: string | undefined;
}) {
    const ctx = useMemo(() => initContext(), []);

    useFocusEffect(
        useCallback(() => {
            ctx.resetStore();
            ctx.setSessionKey(sessionKey);
        }, [sessionKey]),
    );

    if (!sessionKey) {
        return null;
    }

    ctx.setSessionKey(sessionKey);
    return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

function initContext() {
    let store = initStore();
    const api = {
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
        resetGameOver,
        getSessionKey,
        setSessionKey,
        resetStore,
    } as const;

    function resetStore() {
        store = initStore();
    }

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

    function resetGameOver() {
        store.gameState.gameOver = false;
    }

    function getDirection(player: number): SnakeDirection {
        const coords = store.coords.get(player);
        if (!coords) {
            return "RIGHT";
        }

        const p1 = coords[0];
        const p2 = coords[1];

        return snakeSegmentDir(p1, p2, undefined);
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

    return api;
}

function initStore(): typeof defaultValus {
    return {
        tickN: defaultValus.tickN,
        boardSize: defaultValus.boardSize,
        playerCount: defaultValus.playerCount,
        sessionKey: defaultValus.sessionKey,
        me: defaultValus.me,
        gameState: {
            gameOver: defaultValus.gameState.gameOver,
            gameOverCause: defaultValus.gameState.gameOverCause,
        },
        coords: new Map(defaultValus.coords),
        food: new Map(defaultValus.food),
        debug: {
            flags: defaultValus.debug.flags, // should never change
        },
    };
}
