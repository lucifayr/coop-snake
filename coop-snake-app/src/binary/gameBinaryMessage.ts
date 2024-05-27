import { assert } from "../assert";
import { GameMessageType, msgTypeFromByte } from "./gameMessageTypes";
import { bytesToUint32 } from "./utils";

export type GameBinaryMessage = {
    version: number;
    messageType: GameMessageType;
    dataLenght: number;
    data: Uint8Array;
};

const MESSAGE_VERSION = parseInt(process.env.EXPO_MESSAGE_VERSION ?? "");
const MESSAGE_HEADER_WIDTH_VERSION = 1;
const MESSAGE_HEADER_WIDTH_TYPE = 4;
const MESSAGE_HEADER_WIDTH_DATA_LENGTH = 4;

export function binMsgFromBytes(bytes: Uint8Array): GameBinaryMessage {
    const version = bytes[0];
    assert(
        version === MESSAGE_VERSION,
        `Version mismatch. Expected ${MESSAGE_VERSION}. Received ${version}.`,
    );

    const typeStartIdx = MESSAGE_HEADER_WIDTH_VERSION;
    const typeEndIdx = typeStartIdx + MESSAGE_HEADER_WIDTH_TYPE;
    const typeBytes = bytes.subarray(typeStartIdx, typeEndIdx);
    const type = msgTypeFromByte(typeBytes);

    const lenStartIdx = typeEndIdx;
    const lenEndIdx = lenStartIdx + MESSAGE_HEADER_WIDTH_DATA_LENGTH;
    const lenBytes = bytes.subarray(lenStartIdx, lenEndIdx);
    const len = bytesToUint32(lenBytes);

    const dataStartIdx = lenEndIdx;
    const dataEndIdx = dataStartIdx + len;
    assert(
        bytes.length >= dataEndIdx,
        `Message is too short. Expected minium length ${dataEndIdx} but only got length ${bytes.length}`,
    );

    const data = bytes.subarray(dataStartIdx, dataEndIdx);

    return {
        version,
        data,
        messageType: type,
        dataLenght: len,
    };
}
