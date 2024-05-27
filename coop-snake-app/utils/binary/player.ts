import { assert } from "../assert";

export const PLAYERS = {
  Player1: Uint8Array.of(...[1]),
  Player2: Uint8Array.of(...[2]),
} as const;

export type Player = keyof typeof PLAYERS;

export const PLAYER_BYTE_WIDTH = 1;

export function playerFromByte(byte: Uint8Array): Player {
  assert(
    byte.length === PLAYER_BYTE_WIDTH,
    `Expected player identifier to be 1 byte long. Received bytes ${byte}`,
  );

  switch (byte[0]) {
    case 1:
      return "Player1";
    case 2:
      return "Player2";
    default:
      throw new Error(`Expected valid player identifier. Received ${byte[0]}`);
  }
}

export function msgTypeIntoByte(type: Player): Uint8Array {
  return PLAYERS[type];
}
