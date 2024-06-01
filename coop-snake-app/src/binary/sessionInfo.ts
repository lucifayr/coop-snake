import { assert } from "../assert";

const SESSION_INFO_TYPES = {
    SessionKey: 0,
    PlayerToken: 1,
    BoardSize: 2,
} as const;

type SessionInfoType = keyof typeof SESSION_INFO_TYPES;

function infoTypeFromByte(byte: number): SessionInfoType {
    for (const key in SESSION_INFO_TYPES) {
        const k = key as SessionInfoType;
        const v = SESSION_INFO_TYPES[k];
        if (v === byte) {
            return k;
        }
    }

    throw new Error(`Expected valid session info type type. Received ${byte}`);
}

export type SessionInfo = { type: SessionInfoType; value: number };

export function parseSessionInfoMsg(bytes: DataView): SessionInfo {
    assert(
        bytes.byteLength === 5,
        `Expected 5 bytes of data for session info msg. Received ${bytes.byteLength}`,
    );

    const typeByte = bytes.getUint8(0);
    const type = infoTypeFromByte(typeByte);
    const value = bytes.getUint32(1);

    return { value, type: type! };
}
