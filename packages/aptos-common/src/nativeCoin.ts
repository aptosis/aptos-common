import type { CoinInfo } from "@movingco/core";
import { ChainId, Coin, CoinAmount } from "@movingco/core";

const NATIVE_COIN_INFO: CoinInfo = {
  name: "Aptos",
  symbol: "APTOS",
  logoURI:
    "https://raw.githubusercontent.com/aptosis/aptosis-coin-list/master/assets/devnet/apt.svg",
  decimals: 8,
  address: "0x1::aptos_coin::AptosCoin",
  chainId: ChainId.AptosDevnet,
};

export const NATIVE_COIN = new Coin(NATIVE_COIN_INFO);

export const ZERO_NATIVE_COINS = new CoinAmount(NATIVE_COIN, 0);
