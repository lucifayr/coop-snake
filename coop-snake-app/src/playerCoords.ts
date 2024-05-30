import { assert } from "./assert";
import {
    Coordinate,
    coordsArrayFromBytes,
    validateCoords,
} from "./binary/coordinate";
import { GameBinaryMessage } from "./binary/gameBinaryMessage";
import { PLAYER_BYTE_WIDTH, Player, playerFromU8 } from "./binary/player";
import { viewSlice } from "./binary/utils";

export type PlayerCoordinates = {
    player: Player;
    tickN: number;
    coords: Coordinate[];
};

export function playerCoordsFromMsg(msg: GameBinaryMessage): PlayerCoordinates {
    assert(
        msg.messageType === "PlayerPosition",
        `Expected type of message to be 'PlayerPosition'. Received ${msg.messageType}.`,
    );

    const player = playerFromU8(msg.data.getUint8(0));
    const tickN = msg.data.getUint32(PLAYER_BYTE_WIDTH);
    const dataOffset = PLAYER_BYTE_WIDTH + 4;
    const coords = coordsArrayFromBytes(
        viewSlice(msg.data, dataOffset, msg.data.byteLength - dataOffset),
    );

    validateCoords(coords);

    return { player, tickN, coords };
}
