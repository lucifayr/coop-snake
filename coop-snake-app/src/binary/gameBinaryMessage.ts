import { assert } from "../assert";
import { GameMessageType, msgTypeFromU32 } from "./gameMessageTypes";

export type GameBinaryMessage = {
    version: number;
    messageType: GameMessageType;
    dataLenght: number;
    data: DataView;
};

export const MESSAGE_VERSION = 1;

const MESSAGE_HEADER_WIDTH_VERSION = 1;
const MESSAGE_HEADER_WIDTH_TYPE = 4;
const MESSAGE_HEADER_WIDTH_DATA_LENGTH = 4;

export function binMsgFromBytes(bytes: DataView): GameBinaryMessage {
    const version = bytes.getUint8(0);
    assert(
        version === MESSAGE_VERSION,
        `Version mismatch. Expected ${MESSAGE_VERSION}. Received ${version}.`,
    );

    const typeStartIdx = MESSAGE_HEADER_WIDTH_VERSION;
    const typeInt = bytes.getUint32(typeStartIdx);
    const type = msgTypeFromU32(typeInt);

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
        dataLenght: len,
    };
}
