import { Coordinate } from "../binary/coordinate";
import { Player } from "../binary/player";

const store = {
    coords: {
        Player1: [] as Coordinate[],
        Player2: [] as Coordinate[],
    },
    tickN: 0,
    boardSize: 32,
};

export const global = {
    getCoords,
    setCoords,
    getTickN,
    setTickN,
    getBoardSize,
    setBoardSize,
} as const;

function getCoords(player: Player): Coordinate[] {
    return store.coords[player];
}

function setCoords(player: Player, coords: Coordinate[]) {
    store.coords[player] = coords;
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
