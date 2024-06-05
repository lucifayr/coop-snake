import { assert } from "./assert";
import { Coordinate, coordFromBytes } from "./binary/coordinate";
import { GameBinaryMessage } from "./binary/gameBinaryMessage";
import { PLAYER_BYTE_WIDTH, Player, playerFromU8 } from "./binary/player";

export type FoodCoordinate = {
    player: Player;
    coord: Coordinate;
};

export function foodCoordFromMsg(msg: GameBinaryMessage): FoodCoordinate {
    assert(
        msg.messageType === "FoodPosition",
        `Expected type of message to be 'FoodPosition'. Received ${msg.messageType}.`,
    );

    const player = playerFromU8(msg.data.getUint8(0));
    const coord = coordFromBytes(msg.data, PLAYER_BYTE_WIDTH);

    return { player, coord };
}
