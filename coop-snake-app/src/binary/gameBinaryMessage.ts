import { assert } from "../assert";
import {
    GAME_MESSAGE_TYPE_BYTES,
    GameMessageType,
    msgTypeIntoBytes,
} from "./gameMessageTypes";
import { constKeyFromValueMap, copyDataView, u32ToBytes } from "./utils";

export type GameBinaryMessage = {
    version: number;
    messageType: GameMessageType;
    dataLength: number;
    data: DataView;
};

export const MESSAGE_VERSION = 1;

const MESSAGE_HEADER_WIDTH_VERSION = 1;
const MESSAGE_HEADER_WIDTH_TYPE = 4;
const MESSAGE_HEADER_WIDTH_DATA_LENGTH = 4;

export function binMsgFromData(
    type: GameMessageType,
    data: DataView,
): GameBinaryMessage {
    return {
        version: MESSAGE_VERSION,
        dataLength: data.byteLength,
        messageType: type,
        data,
    };
}

export function binMsgIntoBytes(msg: GameBinaryMessage): Uint8Array {
    return Uint8Array.of(
        ...[
            msg.version,
            ...msgTypeIntoBytes(msg.messageType),
            ...u32ToBytes(msg.dataLength),
            ...copyDataView(msg.data),
        ],
    );
}

export function binMsgFromBytes(bytes: DataView): GameBinaryMessage {
    const version = bytes.getUint8(0);
    assert(
        version === MESSAGE_VERSION,
        `Version mismatch. Expected ${MESSAGE_VERSION}. Received ${version}.`,
    );

    const typeStartIdx = MESSAGE_HEADER_WIDTH_VERSION;
    const typeInt = bytes.getUint32(typeStartIdx);
    const type = constKeyFromValueMap(typeInt, GAME_MESSAGE_TYPE_BYTES);

    const lenStartIdx = typeStartIdx + MESSAGE_HEADER_WIDTH_TYPE;
    const len = bytes.getUint32(lenStartIdx);

    const dataStartIdx = lenStartIdx + MESSAGE_HEADER_WIDTH_DATA_LENGTH;
    const dataEndIdx = dataStartIdx + len;

    assert(
        bytes.byteLength >= dataEndIdx,
        `Message is too short. Expected minium length ${dataEndIdx} but only got length ${bytes.byteLength}`,
    );

    const data = new DataView(bytes.buffer, dataStartIdx, len);
    return {
        version,
        data,
        messageType: type,
        dataLength: len,
    };
}
