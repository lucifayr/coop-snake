import { assert } from "../assert";

export type BufferState = {
    bytes: Uint8Array;
    canonicalLen: number;
    view: (offset?: number, len?: number) => DataView;
    writeCanonicalBytes: (buf: DataView) => void;
    reAllocateBuf: (capacity: number) => void;
};

export function useBuffer(capacity: number): BufferState {
    let obj = {
        bytes: new Uint8Array(capacity),
        canonicalLen: 0,
    } as any;

    const writeCanonicalBytes = (buf: DataView) => {
        assert(
            buf.byteLength <= obj.bytes.length,
            `Coord buffer is to small to contain byte values. Current size ${obj.bytes.length}. Needed size ${buf.byteLength}.`,
        );

        obj.canonicalLen = buf.byteLength;
        for (let i = 0; i < buf.byteLength; i++) {
            obj.bytes[i] = buf.getUint8(i);
        }
    };

    const reAllocateBuf = (capacity: number) => {
        obj.bytes = new Uint8Array(capacity);
        obj.canonicalLen = 0;
    };

    const view = (offset?: number, len?: number) => {
        const o = offset ?? 0;
        const l = len ?? obj.canonicalLen - o;
        const v = new DataView(obj.bytes.buffer, o, l);
        return v;
    };

    obj.writeCanonicalBytes = writeCanonicalBytes;
    obj.reAllocateBuf = reAllocateBuf;
    obj.view = view;

    return obj;
}
