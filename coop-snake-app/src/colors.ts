const playerColors = {
    0: "#ea580c",
    1: "#65a30d",
    2: "#22d3ee",
    3: "#c026d3",
    4: "#f43f5e",
};

const foodColors = {
    0: "#818cf8",
    1: "#eab308",
    2: "#166534",
    3: "#b91c1c",
    4: "#4c1d95",
};

export function getPlayerColor(player: number): string {
    const idx = (player %
        Object.keys(playerColors).length) as keyof typeof playerColors;
    return playerColors[idx];
}

export function getFoodColor(player: number): string {
    const idx = (player %
        Object.keys(foodColors).length) as keyof typeof foodColors;
    return foodColors[idx];
}
