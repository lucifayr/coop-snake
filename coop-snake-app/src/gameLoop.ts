import { Snake } from "@/components/Game/Snake";
import { Food } from "@/components/Game/Food";
import { GameEntities } from "@/components/Game/GameRenderer";
import { GameContextApi } from "./context/gameContext";

export const randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const GameLoop = (
    ctx: GameContextApi,
    entities: GameEntities,
): GameEntities => {
    if (ctx.getGameOverInfo().gameOver) {
        return entities;
    }

    for (let i = 1; i <= ctx.getPlayerCount(); i++) {
        const playerCoords = ctx.getCoords(i) ?? [];
        const foodCoord = ctx.getFood(i);

        const player = entities.players[i];
        if (!player) {
            entities.players[i] = {
                ctx,
                playerId: i,
                coords: playerCoords,
                renderer: Snake,
            };
        } else {
            player.coords = playerCoords;
        }

        const food = entities.foods[i];
        if (!food) {
            entities.foods[i] = {
                ctx,
                playerId: i,
                coord: foodCoord,

                renderer: Food,
            };
        } else {
            food.coord = foodCoord;
        }
    }

    return entities;
};
