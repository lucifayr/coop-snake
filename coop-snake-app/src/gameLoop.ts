import { GameEntities } from "@/app/(tabs)/game";
import { dbgNextCoords } from "./debug/helpers";
import { coordsArrayFromBytes } from "./binary/coordinate";

export const randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// events: { touches: any; dispatch: any; events: any },
export const GameLoop = (entities: GameEntities): GameEntities => {
    if (entities.debug.data) {
        const [coordArrayBytes, offset] = dbgNextCoords(
            entities.debug.data.rawCoords,
            entities.debug.data.rawCoordsOffset,
        );

        entities.debug.data.rawCoordsOffset = offset;
        entities.player1.coords = coordsArrayFromBytes(coordArrayBytes);
    }

    return entities;
};
