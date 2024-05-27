const COORD_TERMINATOR_BYTE = 0b11111111;

export function dbgNextCoords(
    data: Uint8Array,
    offset: number,
): [Uint8Array, number] {
    const bytes = [];

    let i = offset;
    for (; i < data.length; i++) {
        const isTerminated =
            data[i] === COORD_TERMINATOR_BYTE &&
            data[i - 1] === COORD_TERMINATOR_BYTE &&
            data[i - 2] === COORD_TERMINATOR_BYTE &&
            data[i - 3] === COORD_TERMINATOR_BYTE;
        if (isTerminated) {
            bytes.pop();
            bytes.pop();
            bytes.pop();
            break;
        }

        bytes[i - offset] = data[i];
    }

    const newOffset = i + 1 < data.length ? i + 1 : 0;
    return [Uint8Array.of(...bytes), newOffset];
}
