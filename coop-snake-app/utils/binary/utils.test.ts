import { bytesToUint32 } from "./utils";

describe("bytesToUint32", () => {
  it("should convert bytes to int32s correctly", () => {
    const case1 = Uint8Array.of(...[0, 0, 2, 3]);
    expect(bytesToUint32(case1)).toEqual(515);

    const case2 = Uint8Array.of(...[0, 0, 0, 201]);
    expect(bytesToUint32(case2)).toEqual(201);

    const case3 = Uint8Array.of(...[2, 0, 0, 1]);
    expect(bytesToUint32(case3)).toEqual(33554433);
  });

  it("should throw when invalid bytes are given", () => {
    const case1 = Uint8Array.of(...[1, 2, 3, 4, 5]);
    expect(() => bytesToUint32(case1)).toThrow(Error);

    const case2 = Uint8Array.of(...[1]);
    expect(() => bytesToUint32(case2)).toThrow(Error);
  });
});
