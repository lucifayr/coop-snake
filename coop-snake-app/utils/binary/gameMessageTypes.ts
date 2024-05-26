import { bytesToInt32 } from "./utils";

export const GAME_MESSAGE_TYPE_BYTES = {
  SnakePosition: new Uint8Array(1).fill(0),
  PlayerInput: new Uint8Array(1).fill(1),
} as const;

export type GameMessageType = keyof typeof GAME_MESSAGE_TYPE_BYTES;

export function msgTypeFromByte(bytes: Uint8Array): GameMessageType {
  const int = bytesToInt32(bytes);
  switch (int) {
    case 0:
      return "SnakePosition";
    case 1:
      return "PlayerInput";
    default:
      throw new Error(`Expected valid message type. Received ${int}`);
  }
}

export function msgTypeIntoByte(type: GameMessageType): Uint8Array {
  return GAME_MESSAGE_TYPE_BYTES[type];
}
