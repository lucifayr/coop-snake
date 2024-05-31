export const GAME_MESSAGE_TYPE_BYTES = {
    PlayerPosition: Uint8Array.of(...[0, 0, 0, 0]),
    PlayerSwipeInput: Uint8Array.of(...[0, 0, 0, 1]),
    SessionInfo: Uint8Array.of(...[0, 0, 0, 2]),
} as const;

export type GameMessageType = keyof typeof GAME_MESSAGE_TYPE_BYTES;

export function msgTypeFromU32(value: number): GameMessageType {
    switch (value) {
        case 0:
            return "PlayerPosition";
        case 1:
            return "PlayerSwipeInput";
        case 2:
            return "SessionInfo";
        default:
            throw new Error(`Expected valid message type. Received ${value}`);
    }
}

export function msgTypeIntoBytes(type: GameMessageType): Uint8Array {
    return GAME_MESSAGE_TYPE_BYTES[type];
}
