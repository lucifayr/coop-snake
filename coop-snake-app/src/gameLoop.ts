import { globalData } from "./stores/globalStore";
import { Snake } from "@/components/Game/Snake";
import { Food } from "@/components/Game/Food";
import { GameEntities } from "@/components/Game/GameRenderer";

export const randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const GameLoop = (entities: GameEntities): GameEntities => {
    if (globalData.getGameOverInfo().gameOver) {
        return entities;
    }

    for (let i = 1; i <= globalData.getPlayerCount(); i++) {
        const playerCoords = globalData.getCoords(i) ?? [];
        const foodCoord = globalData.getFood(i);

        const player = entities.players[i];
        if (!player) {
            entities.players[i] = {
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
