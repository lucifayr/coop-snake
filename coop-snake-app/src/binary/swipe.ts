import { GameBinaryMessage, MESSAGE_VERSION } from "./gameBinaryMessage";
import { u32ToBytes } from "./utils";

const SWIPE_INPUT_BYTES = {
    up: 0,
    right: 1,
    down: 2,
    left: 3,
} as const;

export type SwipeInputKind = keyof typeof SWIPE_INPUT_BYTES;

export function swipeInputMsg(
    kind: SwipeInputKind,
    frameTimestamp: number,
): GameBinaryMessage {
    const data = new DataView(swipeInputMsgData(kind, frameTimestamp).buffer);
    return {
        version: MESSAGE_VERSION,
        messageType: "PlayerSwipeInput",
        dataLength: data.byteLength,
        data,
    };
}

function swipeInputMsgData(
    kind: SwipeInputKind,
    frameTimestamp: number,
): Uint8Array {
    const frameTimestampBytes = u32ToBytes(frameTimestamp);
    return Uint8Array.of(...[SWIPE_INPUT_BYTES[kind], ...frameTimestampBytes]);
}
