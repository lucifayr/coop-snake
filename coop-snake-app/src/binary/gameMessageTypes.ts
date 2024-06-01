export const GAME_MESSAGE_TYPE_BYTES = {
    PlayerPosition: Uint8Array.of(...[0, 0, 0, 0]),
    PlayerSwipeInput: Uint8Array.of(...[0, 0, 0, 1]),
    SessionInfo: Uint8Array.of(...[0, 0, 0, 2]),
    FoodPosition: Uint8Array.of(...[0, 0, 0, 3]),
} as const;

export type GameMessageType = keyof typeof GAME_MESSAGE_TYPE_BYTES;

export function msgTypeFromU32(value: number): GameMessageType {
    for (const key in GAME_MESSAGE_TYPE_BYTES) {
        const k = key as GameMessageType;
        const v = new DataView(GAME_MESSAGE_TYPE_BYTES[k].buffer).getUint32(0);
        if (v === value) {
            return k;
        }
    }

    throw new Error(`Expected valid message type. Received ${value}`);
}

export function msgTypeIntoBytes(type: GameMessageType): Uint8Array {
    return GAME_MESSAGE_TYPE_BYTES[type];
}
