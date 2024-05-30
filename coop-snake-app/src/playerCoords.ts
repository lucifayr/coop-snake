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
    coords: Coordinate[];
};

export function playerCoordsFromMsg(msg: GameBinaryMessage): PlayerCoordinates {
    assert(
        msg.messageType === "PlayerPosition",
        `Expected type of message to be 'PlayerPosition'. Received ${msg.messageType}.`,
    );

    const player = playerFromU8(msg.data.getUint8(0));
    const coords = coordsArrayFromBytes(
        viewSlice(
            msg.data,
            PLAYER_BYTE_WIDTH,
            msg.data.byteLength - PLAYER_BYTE_WIDTH,
        ),
    );

    validateCoords(coords);

    return { player, coords };
}
