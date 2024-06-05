import { GameEntities } from "@/app/(tabs)/game";
import { globalS } from "./stores/globalStore";

export const randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const GameLoop = (entities: GameEntities): GameEntities => {
    if (globalS.getGameOverInfo().gameOver) {
        return entities;
    }

    const coordsP1 = globalS.getCoords("Player1");
    const coordsP2 = globalS.getCoords("Player2");
    const foodP1 = globalS.getFood("Player1");
    const foodP2 = globalS.getFood("Player2");

    entities.player1.coords = coordsP1;
    entities.player2.coords = coordsP2;
    entities.food1.coord = foodP1;
    entities.food2.coord = foodP2;

    return entities;
};
