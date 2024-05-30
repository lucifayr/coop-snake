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
    tickN: number,
): GameBinaryMessage {
    const data = new DataView(swipeInputMsgData(kind, tickN).buffer);
    return {
        version: MESSAGE_VERSION,
        messageType: "PlayerSwipeInput",
        dataLength: data.byteLength,
        data,
    };
}

function swipeInputMsgData(kind: SwipeInputKind, tickN: number): Uint8Array {
    const tickNBytes = u32ToBytes(tickN);
    return Uint8Array.of(...[SWIPE_INPUT_BYTES[kind], ...tickNBytes]);
}
