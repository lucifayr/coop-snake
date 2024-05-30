export const PLAYERS = {
    Player1: Uint8Array.of(...[1]),
    Player2: Uint8Array.of(...[2]),
} as const;

export type Player = keyof typeof PLAYERS;

export const PLAYER_BYTE_WIDTH = 1;

export function playerFromU8(byte: number): Player {
    switch (byte) {
        case 1:
            return "Player1";
        case 2:
            return "Player2";
        default:
            throw new Error(
                `Expected valid player identifier. Received ${byte}`,
            );
    }
}

export function msgTypeIntoByte(type: Player): Uint8Array {
    return PLAYERS[type];
}
