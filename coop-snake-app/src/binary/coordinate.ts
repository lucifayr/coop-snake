import { assert } from "../assert";

export type Coordinate = {
    x: number;
    y: number;
};

export const COORDINATE_BYTE_WIDTH = 4;

export function coordFromBytes(bytes: DataView, offset: number): Coordinate {
    const x = bytes.getUint16(offset);
    const y = bytes.getUint16(offset + 2);

    return { x, y };
}

export function coordsArrayFromBytes(bytes: DataView): Coordinate[] {
    assert(
        bytes.byteLength % COORDINATE_BYTE_WIDTH === 0,
        `Coordinate is not aligned correctly. Length % ${COORDINATE_BYTE_WIDTH} should == 0`,
    );

    const coordCount = bytes.byteLength / COORDINATE_BYTE_WIDTH;
    const coords = new Array(coordCount);

    for (let i = 0; i < bytes.byteLength; i += COORDINATE_BYTE_WIDTH) {
        const coord = coordFromBytes(bytes, i);
        const idx = i / COORDINATE_BYTE_WIDTH;
        coords[idx] = coord;
    }

    return coords;
}
