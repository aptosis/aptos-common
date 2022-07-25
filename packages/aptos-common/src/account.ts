import type { HexEncodedBytes } from "@aptosis/aptos-api";
import type { HexStringLike, MaybeHexString, Signer } from "@movingco/core";
import { Address, HexString, PublicKey } from "@movingco/core";
import * as Nacl from "tweetnacl";

/**
 * JSON-serializable representation of an {@link Account}.
 */
export interface AccountObject {
  address?: string;
  publicKeyHex?: HexEncodedBytes;
  privateKeyHex: HexEncodedBytes;
}

/**
 * Backed by a signing key.
 */
export class Account implements Signer {
  readonly address: Address;
  readonly pubKey: PublicKey;

  /**
   * A private key and public key, associated with the given account
   */
  readonly signingKey: Nacl.SignKeyPair;

  private _authKeyCached: Address | null = null;

  constructor(privateKeyBytes?: Uint8Array, rawAddress?: MaybeHexString) {
    if (privateKeyBytes) {
      this.signingKey = Nacl.sign.keyPair.fromSeed(
        privateKeyBytes.slice(0, 32)
      );
    } else {
      this.signingKey = Nacl.sign.keyPair();
    }
    this.pubKey = new PublicKey(this.signingKey.publicKey);
    this.address = Address.ensure(rawAddress ?? this.authKey.hex());
  }

  /**
   * Creates an {@link Account} from an account object.
   */
  static fromObject(obj: AccountObject): Account {
    return new Account(
      HexString.ensure(obj.privateKeyHex).toUint8Array(),
      obj.address
    );
  }

  /**
   * Loads a {@link Account} from a private (signing) key.
   *
   * @param seed The seed of the private key.
   * @param address The address of the account, in hex.
   * @returns
   */
  static fromSeed(seed: Uint8Array, address?: HexStringLike) {
    return new Account(
      seed,
      address
        ? typeof address === "string"
          ? address
          : address.hex()
        : undefined
    );
  }

  /**
   * Generates a random {@link Account}.
   * @returns
   */
  static generate(): Account {
    return new Account();
  }

  /**
   * Gets the authKey.
   */
  get authKey(): Address {
    return (
      this._authKeyCached ??
      (this._authKeyCached = this.pubKey.toAptosAuthKey())
    );
  }

  /**
   * Signs specified `buffer` with account's private key
   * @param buffer A buffer to sign
   * @returns A signature HexString
   */
  signBufferSync(buffer: Uint8Array): Uint8Array {
    const signature = Nacl.sign(buffer, this.signingKey.secretKey);
    return signature.slice(0, 64);
  }

  /**
   * Signs specified `hexString` with account's private key
   * @param hexString A regular string or HexString to sign
   * @returns A signature HexString
   */
  signHexString(hexString: MaybeHexString): HexString {
    const toSign = HexString.ensure(hexString).toUint8Array();
    return HexString.fromUint8Array(this.signBufferSync(toSign));
  }

  signData(buffer: Uint8Array): Promise<Uint8Array> {
    return Promise.resolve(this.signBufferSync(buffer));
  }

  /**
   * Derives account address, public key and private key
   * @returns AptosAccountObject instance.
   * @example An example of the returned AptosAccountObject object
   * ```
   * {
   *    address: "0xe8012714cd17606cee7188a2a365eef3fe760be598750678c8c5954eb548a591",
   *    publicKeyHex: "0xf56d8524faf79fbc0f48c13aeed3b0ce5dd376b4db93b8130a107c0a5e04ba04",
   *    privateKeyHex: `0x009c9f7c992a06cfafe916f125d8adb7a395fca243e264a8e56a4b3e6accf940
   *      d2b11e9ece3049ce60e3c7b4a1c58aebfa9298e29a30a58a67f1998646135204`
   * }
   * ```
   */
  toPrivateKeyObject(): AccountObject {
    return {
      address: this.address.hex(),
      publicKeyHex: this.pubKey.hex(),
      privateKeyHex: HexString.fromUint8Array(
        this.signingKey.secretKey.slice(0, 32)
      ).hex(),
    };
  }
}
