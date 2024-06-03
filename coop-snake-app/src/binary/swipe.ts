import { assert } from "../assert";
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
    token: number | undefined,
): GameBinaryMessage {
    assert(
        token !== undefined,
        "Received undefined token. Token needs to be to send input data.",
    );
    assert(
        !Number.isNaN(token),
        "Received NaN token. Token needs to be to send input data.",
    );

    const data = new DataView(swipeInputMsgData(kind, tickN, token!).buffer);
    return {
        version: MESSAGE_VERSION,
        messageType: "PlayerSwipeInput",
        dataLength: data.byteLength,
        data,
    };
}

function swipeInputMsgData(
    kind: SwipeInputKind,
    tickN: number,
    token: number,
): Uint8Array {
    const tokenBytes = u32ToBytes(token);
    const tickNBytes = u32ToBytes(tickN);
    return Uint8Array.of(
        ...tokenBytes,
        ...[SWIPE_INPUT_BYTES[kind], ...tickNBytes],
    );
}
