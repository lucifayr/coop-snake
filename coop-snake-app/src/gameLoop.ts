import { GameEntities } from "@/app/(tabs)/game";
import { global } from "./stores/globalStore";

export const randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const GameLoop = (entities: GameEntities): GameEntities => {
    const coordsP1 = global.getCoords("Player1");
    const coordsP2 = global.getCoords("Player2");
    const foodP1 = global.getFood("Player1");
    const foodP2 = global.getFood("Player2");

    entities.player1.coords = coordsP1;
    entities.player2.coords = coordsP2;
    entities.food1.coord = foodP1;
    entities.food2.coord = foodP2;

    return entities;
};
