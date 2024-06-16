import { u32ToBytes } from "./utils";

export const GAME_MESSAGE_TYPE_BYTES = {
    PlayerPosition: 0,
    PlayerSwipeInput: 1,
    SessionInfo: 2,
    FoodPosition: 3,
    PlayerRestartConfirm: 4,
    PlayerRestartDeny: 5,
    ErrorInvalidVersion: 20,
    ErrorInvalidType: 21,
    ErrorInvalidDataLength: 22,
} as const;

export type GameMessageType = keyof typeof GAME_MESSAGE_TYPE_BYTES;

export function msgTypeIntoBytes(type: GameMessageType): Uint8Array {
    return u32ToBytes(GAME_MESSAGE_TYPE_BYTES[type]);
}
