import { bytesToUint32 } from "./utils";

export const GAME_MESSAGE_TYPE_BYTES = {
  PlayerPosition: Uint8Array.of(...[0]),
  PlayerInput: Uint8Array.of(...[1]),
} as const;

export type GameMessageType = keyof typeof GAME_MESSAGE_TYPE_BYTES;

export function msgTypeFromByte(bytes: Uint8Array): GameMessageType {
  const int = bytesToUint32(bytes);
  switch (int) {
    case 0:
      return "PlayerPosition";
    case 1:
      return "PlayerInput";
    default:
      throw new Error(`Expected valid message type. Received ${int}`);
  }
}

export function msgTypeIntoByte(type: GameMessageType): Uint8Array {
  return GAME_MESSAGE_TYPE_BYTES[type];
}
