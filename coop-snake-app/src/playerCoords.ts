import { assert } from "./assert";
import {
    Coordinate,
    coordsArrayFromBytes,
    validateCoords,
} from "./binary/coordinate";
import { GameBinaryMessage } from "./binary/gameBinaryMessage";
import { PLAYER_BYTE_WIDTH, Player, playerFromByte } from "./binary/player";

export type PlayerCoordinates = {
    player: Player;
    coords: Coordinate[];
};

export function playerCoordsFromMsg(msg: GameBinaryMessage): PlayerCoordinates {
    assert(
        msg.messageType === "PlayerPosition",
        `Expected type of message to be 'PlayerPosition'. Received ${msg.messageType}.`,
    );

    const data = msg.data;
    const player = playerFromByte(msg.data.subarray(0, PLAYER_BYTE_WIDTH));
    const coords = coordsArrayFromBytes(
        data.subarray(PLAYER_BYTE_WIDTH, msg.dataLenght),
    );
    validateCoords(coords);

    return { player, coords };
}
