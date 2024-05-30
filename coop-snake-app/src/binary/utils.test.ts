import { u32ToBytes } from "./utils";

describe("bytesToUint32", () => {
    it("should convert u32s to bytes correctly", () => {
        const case1 = 515;
        expect(u32ToBytes(case1)).toEqual(Uint8Array.of(...[0, 0, 2, 3]));

        const case2 = 201;
        expect(u32ToBytes(case2)).toEqual(Uint8Array.of(...[0, 0, 0, 201]));

        const case3 = 33554433;
        expect(u32ToBytes(case3)).toEqual(Uint8Array.of(...[2, 0, 0, 1]));
    });
});
