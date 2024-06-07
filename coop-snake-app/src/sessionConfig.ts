export type SessionConfig = {
    initialSnakeSize?: number;
    boardSize?: number;
    playerCount?: number;
};

export async function newSession(
    config: SessionConfig,
): Promise<string | undefined> {
    try {
        const resp = await fetch(
            `${process.env.EXPO_PUBLIC_HTTP_BASE_URL}/game/session/new`,
            {
                body: JSON.stringify(config),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        const text = await resp.text();
        return text.trim();
    } catch (err) {
        console.error(err);
        return undefined;
    }
}
