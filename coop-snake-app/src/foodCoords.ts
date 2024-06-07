import { assert } from "./assert";
import { Coordinate, coordFromBytes } from "./binary/coordinate";
import { GameBinaryMessage } from "./binary/gameBinaryMessage";

export type FoodCoordinate = {
    player: number;
    coord: Coordinate;
};

export function foodCoordFromMsg(msg: GameBinaryMessage): FoodCoordinate {
    assert(
        msg.messageType === "FoodPosition",
        `Expected type of message to be 'FoodPosition'. Received ${msg.messageType}.`,
    );

    const player = msg.data.getUint8(0);
    const coord = coordFromBytes(msg.data, 1);

    return { player, coord };
}
