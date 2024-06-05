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
