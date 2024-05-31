import { assert } from "../assert";

const SESSION_INFO_TYPES = {
    SessionKey: 0,
    PlayerToken: 1,
    BoardSize: 2,
} as const;

type SessionInfoType = keyof typeof SESSION_INFO_TYPES;

function infoTypeFromByte(byte: number): SessionInfoType | undefined {
    switch (byte) {
        case SESSION_INFO_TYPES["SessionKey"]:
            return "SessionKey";
        case SESSION_INFO_TYPES["PlayerToken"]:
            return "PlayerToken";
        case SESSION_INFO_TYPES["BoardSize"]:
            return "BoardSize";
        default:
            return undefined;
    }
}

export type SessionInfo = { type: SessionInfoType; value: number };

export function parseSessionInfoMsg(bytes: DataView): SessionInfo {
    assert(
        bytes.byteLength === 5,
        `Expected 5 bytes of data for session info msg. Received ${bytes.byteLength}`,
    );

    const typeByte = bytes.getUint8(0);
    const type = infoTypeFromByte(typeByte);
    assert(type !== undefined, `Received invalid type byte ${typeByte}`);

    const value = bytes.getUint32(1);

    return { value, type: type! };
}
