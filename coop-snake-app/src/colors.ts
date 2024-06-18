export const colors = {
    textLight: "#ffffff",
    textDark: "#000000",
    textGray: "#737373",
    bg: "#27272a",
    bgLight: "#e5e5e5",
    bgDark: "#171717",
    accent: "#34d399",
    accentLight: "#a7f3d0",
    accentDark: "#059669",
    confirm: "#16a34a",
    deny: "#dc2626",
    disabled: "#292524",
} as const;

export const colorMatrixWhite: number[] = [
    1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0,
] as const;

const snakeColors = [
    "#fde047",
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#f97316",
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
