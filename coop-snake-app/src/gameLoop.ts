import { GameEntities } from "@/app/(tabs)/game";
import { dbgNextCoords } from "./debug/helpers";
import { coordsArrayFromBytes, validateCoords } from "./binary/coordinate";
import { useCoordinateStore } from "./stores/coordinateStore";

export const randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const GameLoop = (
    entities: GameEntities,
    // e: { time: { delta: number } },
): GameEntities => {
    const { player1: coordP1 } = useCoordinateStore.getState();
    const { player2: coordP2 } = useCoordinateStore.getState();

    if (entities.debug.data) {
        const [coordArrayBytes, offset] = dbgNextCoords(
            entities.debug.data.rawCoords,
            entities.debug.data.rawCoordsOffset,
        );

        entities.debug.data.rawCoordsOffset = offset;

        const coords = coordsArrayFromBytes(
            new DataView(coordArrayBytes.buffer),
        );
        validateCoords(coords);

        entities.player1.coords = coords;
    } else {
        entities.player1.coords = coordP1;
        entities.player2.coords = coordP2;
    }

    return entities;
};
