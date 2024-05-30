import { Coordinate } from "../binary/coordinate";
import { Player } from "../binary/player";

const store = {
    coords: {
        Player1: [] as Coordinate[],
        Player2: [] as Coordinate[],
    },
    tickN: 0,
};

export function getCoords(player: Player): Coordinate[] {
    return store.coords[player];
}

export function setCoords(player: Player, coords: Coordinate[]) {
    store.coords[player] = coords;
}

export function getTickN(): number {
    return store.tickN;
}

export function setTickN(tickN: number) {
    store.tickN = tickN;
}
