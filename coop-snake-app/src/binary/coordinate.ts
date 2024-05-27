import { assert } from "../assert";
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
