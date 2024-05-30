import { assert } from "../assert";
import { batch } from "../logging";
import { bytesToUint32 } from "./utils";

export type Coordinate = {
    x: number;
    y: number;
};

export const COORDINATE_BYTE_WIDTH = 8;

export function coordFromBytes(bytes: Uint8Array): Coordinate {
    assert(
        bytes.length === COORDINATE_BYTE_WIDTH,
        `Expected ${COORDINATE_BYTE_WIDTH} bytes of data for coordinate. Received bytes ${bytes}`,
    );

    const x = bytesToUint32(bytes.subarray(0, 4));
    const y = bytesToUint32(bytes.subarray(4, 8));

    return { x, y };
}

// TODO: check if the coords list is a valid set of positions for a snake
export function coordsArrayFromBytes(bytes: Uint8Array): Coordinate[] {
    const coordCount = Math.floor(bytes.length / COORDINATE_BYTE_WIDTH);
    const coords = new Array(coordCount);

    for (let i = 0; i < bytes.length; i += COORDINATE_BYTE_WIDTH) {
        const idx = i / COORDINATE_BYTE_WIDTH;
        const coordBytes = bytes.subarray(i, i + COORDINATE_BYTE_WIDTH);
        const cord = coordFromBytes(coordBytes);
        coords[idx] = cord;
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
