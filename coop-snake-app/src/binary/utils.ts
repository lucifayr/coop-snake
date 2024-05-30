import { assert } from "../assert";

export function viewSlice(
    view: DataView,
    offset: number,
    len: number,
): DataView {
    return new DataView(view.buffer, offset + view.byteOffset, len);
}

export function bytesToUint32(bytes: Uint8Array): number {
    assert(
        bytes.length === 4,
        `Byte array should be exactly 4 items long to convert to int 32. Received ${bytes}`,
    );

    let value = 0;
    const highestPower = bytes.length - 1;
    for (let i = highestPower; i >= 0; i--) {
        const weight = highestPower - i;
        value += bytes[i] << (8 * weight);
    }

    return value;
}
