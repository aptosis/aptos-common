import { sha3_256 } from "@movingco/core";

const SALT = "APTOS::RawTransactionWithData";

describe("signingMessage", () => {
  describe("getMultiAgentSigningMessage", () => {
    it("should be identical to Buffer hash", () => {
      const hash = sha3_256.create();
      hash.update(Buffer.from(SALT));
      const prefix = new Uint8Array(hash.arrayBuffer());

      const hash2 = sha3_256.create();
      hash2.update(SALT);
      const prefix2 = new Uint8Array(hash2.arrayBuffer());

      expect(prefix).toEqual(prefix2);
    });
  });
});
