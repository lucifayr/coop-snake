import { GameEntities } from "@/app/(tabs)/game";
import { globalS } from "./stores/globalStore";
import { Snake } from "@/components/Game/Snake";
import { Food } from "@/components/Game/Food";

export const randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const GameLoop = (entities: GameEntities): GameEntities => {
    if (globalS.getGameOverInfo().gameOver) {
        return entities;
    }

    for (let i = 1; i <= globalS.getPlayerCount(); i++) {
        const playerCoords = globalS.getCoords(i) ?? [];
        const foodCoord = globalS.getFood(i);

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
