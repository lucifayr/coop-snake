import { SnakeDirection } from "../stores/globalStore";
import { Coordinate } from "./coordinate";

export function viewSlice(
    view: DataView,
    offset: number,
    len: number,
): DataView {
    return new DataView(view.buffer, offset + view.byteOffset, len);
}

export function copyDataView(view: DataView): Uint8Array {
    const buf = new Uint8Array(view.byteLength);
    for (let i = 0; i < view.byteLength; i++) {
        buf[i] = view.getUint8(i);
    }

    return buf;
}

export function u32ToBytes(value: number): Uint8Array {
    const buf = new Uint8Array(4);

    for (let i = 0; i < 4; i++) {
        const byte = value / Math.pow(2, 8 * (3 - i));
        buf[i] = byte;
    }

    return buf;
}

// TODO: handle wrapping properly
export function snakeSegmentDir(
    s1: Coordinate,
    s2: Coordinate,
    prevDir: SnakeDirection | undefined,
): SnakeDirection {
    const dx = Math.round(s1?.x - s2?.x);
    if (dx === 1) {
        return "RIGHT";
    }
    if (dx === -1) {
        return "LEFT";
    }

    const dy = Math.round(s1?.y - s2?.y);
    if (dy === 1) {
        return "DOWN";
    }
    if (dy === -1) {
        return "UP";
    }

    // fallback
    return prevDir ?? "RIGHT";
}

export function constKeyFromValueMap<O extends { [key: string]: number }>(
    value: number,
    obj: O,
): keyof O {
    for (const key in obj) {
        const k = key as keyof O;
        const v = obj[k];
        if (v === value) {
            return k;
        }
    }

    throw new Error(
        `Expected valid value in object ${JSON.stringify(obj)}. Received ${value}`,
    );
}
