import { binMsgFromBytes } from "./gameBinaryMessage";

describe("GameBinaryMessage", () => {
  it("should parse the binary data into a message correctly", () => {
    const case1 = Uint8Array.of(
      ...[
        // Version
        1,
        // Message Type
        0, 0, 0, 1,
        // Data length
        0, 0, 0, 8,
        // Data
        127, 0, 0, 1, 42, 65, 10, 24,
      ],
    );

    const out = binMsgFromBytes(case1);

    expect(out.version).toEqual(1);
    expect(out.messageType).toEqual("PlayerInput");
    expect(out.dataLenght).toEqual(8);
    expect(out.data).toEqual(Uint8Array.of(...[127, 0, 0, 1, 42, 65, 10, 24]));
  });
});
