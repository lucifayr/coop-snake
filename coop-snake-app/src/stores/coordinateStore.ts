import { Coordinate } from "../binary/coordinate";
import { Player } from "../binary/player";

const c = {
    Player1: [] as Coordinate[],
    Player2: [] as Coordinate[],
};

export function getCoords(player: Player): Coordinate[] {
    return c[player];
}

export function setCoords(player: Player, coords: Coordinate[]) {
    c[player] = coords;
}
