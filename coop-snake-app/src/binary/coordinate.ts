import { assert } from "../assert";
import { batch } from "../logging";

export type Coordinate = {
    x: number;
    y: number;
};

export const COORDINATE_BYTE_WIDTH = 8;

export function coordsArrayFromBytes(bytes: DataView): Coordinate[] {
    assert(
        bytes.byteLength % COORDINATE_BYTE_WIDTH === 0,
        `Coordinate is not aligned correctly. Length % ${COORDINATE_BYTE_WIDTH} should == 0`,
    );

    const coordCount = bytes.byteLength / COORDINATE_BYTE_WIDTH;
    const coords = new Array(coordCount);

    for (let i = 0; i < bytes.byteLength; i += COORDINATE_BYTE_WIDTH) {
        const x = bytes.getUint32(i);
        const y = bytes.getUint32(i + 4);

        const idx = i / COORDINATE_BYTE_WIDTH;
        coords[idx] = { x, y };
    }

    return coords;
}

export function validateCoords(coords: Coordinate[]) {
    const batchLogger = batch(10, "warn");

    for (let i = 1; i < coords.length; i++) {
        const current = coords[i];
        const prev = coords[i - 1];

        const isDuplicate = current.x === prev.x && current.y === prev.y;
        if (isDuplicate) {
            batchLogger.add(
                `INVALID COORINATE LIST: duplicate coordinate.
pos1 ${JSON.stringify(prev)}
pos2 ${JSON.stringify(current)}`,
            );
        }

        const dx = current.x - prev.x;
        const dy = current.x - prev.x;
        const isDiscontinues = Math.abs(dx) > 1 || Math.abs(dy) > 1;

        if (isDiscontinues) {
            batchLogger.add(
                `INVALID COORINATE LIST: coordinates are discontinues.
pos1 ${JSON.stringify(prev)}
pos2 ${JSON.stringify(current)}`,
            );
        }
    }

    batchLogger.flush();
}
