export const PLAYERS = {
    Player1: Uint8Array.of(...[1]),
    Player2: Uint8Array.of(...[2]),
} as const;

export type Player = keyof typeof PLAYERS;

export const PLAYER_BYTE_WIDTH = 1;

export function playerFromU8(byte: number): Player {
    for (const key in PLAYERS) {
        const k = key as Player;
        const v = new DataView(PLAYERS[k].buffer).getUint8(0);
        if (v === byte) {
            return k;
        }
    }

    throw new Error(`Expected valid player identifier. Received ${byte}`);
}

export function msgTypeIntoByte(type: Player): Uint8Array {
    return PLAYERS[type];
}
