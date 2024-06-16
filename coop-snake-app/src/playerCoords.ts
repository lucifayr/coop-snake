import { assert } from "./assert";
import { Coordinate, coordsArrayFromBytes } from "./binary/coordinate";
import { GameBinaryMessage } from "./binary/gameBinaryMessage";
import { viewSlice } from "./binary/utils";

export type PlayerCoordinates = {
    player: number;
    tickN: number;
    coords: Coordinate[];
};

export function playerCoordsFromMsg(msg: GameBinaryMessage): PlayerCoordinates {
    assert(
        msg.messageType === "PlayerPosition",
        `Expected type of message to be 'PlayerPosition'. Received ${msg.messageType}.`,
    );

    const player = msg.data.getUint8(0);
    const tickN = msg.data.getUint32(1);
    const dataOffset = 5;
    const coords = coordsArrayFromBytes(
        viewSlice(msg.data, dataOffset, msg.data.byteLength - dataOffset),
    );

    return { player, tickN, coords };
}
