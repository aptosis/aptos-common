import type { AccountObject } from "./account.js";
import { Account } from "./account.js";

const aptosAccountObject: AccountObject = {
  address: "0x978c213990c4833df71548df7ce49d54c759d6b6d932de22b24d56060b7af2aa",
  privateKeyHex:
    // eslint-disable-next-line max-len
    "0xc5338cd251c22daa8c9c9cc94f498cc8a5c7e1d2e75287a5dda91096fe64efa5de19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c",
  publicKeyHex:
    "0xde19e5d1880cac87d57484ce9ed2e84cf0f9599f12e7cc3a52e4e7657a763f2c",
};

test("generates random accounts", () => {
  const a1 = new Account();
  const a2 = new Account();
  expect(a1.authKey).not.toBe(a2.authKey);
  expect(a1.address.hex()).not.toBe(a2.address.hex());
});

test("accepts custom address", () => {
  const address = "0x777";
  const a1 = new Account(undefined, address);
  expect(a1.address.hex()).toBe(address);
});

test("Deserializes from AccountObject", () => {
  const a1 = Account.fromObject(aptosAccountObject);
  expect(a1.address.hex()).toBe(aptosAccountObject.address);
  expect(a1.pubKey.hex()).toBe(aptosAccountObject.publicKeyHex);
});

test("Deserializes from AccountObject without address", () => {
  const privateKeyObject = { privateKeyHex: aptosAccountObject.privateKeyHex };
  const a1 = Account.fromObject(privateKeyObject);
  expect(a1.address.hex()).toBe(aptosAccountObject.address);
  expect(a1.pubKey.hex()).toBe(aptosAccountObject.publicKeyHex);
});

test("Serializes/Deserializes", () => {
  const a1 = new Account();
  const a2 = Account.fromObject(a1.toPrivateKeyObject());
  expect(a1.authKey.hex()).toBe(a2.authKey.hex());
  expect(a1.address.hex()).toBe(a2.address.hex());
});

test("Signs Strings", () => {
  const a1 = Account.fromObject(aptosAccountObject);
  expect(a1.signHexString("0x77777").hex()).toBe(
    // eslint-disable-next-line max-len
    "0xee2164b084840b671145f6af17ebef4e19012ecf84ac70258df67d4c7eb8b5f4507da39154ca941aa4eea61ddf41ddb8975531fde4dab25246dcfe2279cc1904"
  );
});
