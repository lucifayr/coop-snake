export const colors = {
    playerHighlight: "#eab308",
    gameBorders: "#a3a3a3",
    bgDark: "#171717",
    bg: "#27272a",
    confirm: "green",
    deny: "red",
    disabled: "#262626",
} as const;

const snakeColors = [
    "#fde047",
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#f9a8d4",
] as const;

export function getSnakeColorMatrix(
    playerId: number,
    sessionKey: string | undefined,
): number[] {
    const key = parseInt(sessionKey ?? "0");
    const keyChecked = Number.isNaN(key) ? 0 : key;

    const idx = (playerId + keyChecked) % snakeColors.length;
    const hexColor = snakeColors[idx];
    return hexToColorMatrix(hexColor);
}

function hexToColorMatrix(color: string): number[] {
    const rHex = color[1] + color[2];
    const gHex = color[3] + color[4];
    const bHex = color[5] + color[6];

    const r = parseInt(rHex, 16) / 255;
    const g = parseInt(gHex, 16) / 255;
    const b = parseInt(bHex, 16) / 255;

    return [
        // red
        r,
        0,
        0,
        0,
        0,
        // green
        0,
        g,
        0,
        0,
        0,
        // blue
        0,
        0,
        b,
        0,
        0,
        // alpha
        0,
        0,
        0,
        1,
        0,
    ];
}
