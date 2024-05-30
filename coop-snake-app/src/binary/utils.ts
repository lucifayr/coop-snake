export function viewSlice(
    view: DataView,
    offset: number,
    len: number,
): DataView {
    return new DataView(view.buffer, offset + view.byteOffset, len);
}

export function u32ToBytes(value: number): Uint8Array {
    const buf = new Uint8Array(4);

    for (let i = 0; i < 4; i++) {
        const byte = value / Math.pow(2, 8 * (3 - i));
        buf[i] = byte;
    }

    return buf;
}
