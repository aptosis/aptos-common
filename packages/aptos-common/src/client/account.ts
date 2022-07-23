import type { AptosAPI, AptosAPIResponse } from "@aptosis/aptos-client";
import { raiseForStatus } from "@aptosis/aptos-client";
import type { AccountMetadata } from "@aptosis/aptos-typed-api";
import type { MaybeHexString } from "@movingco/core";
import { HexString } from "@movingco/core";

/**
 * Queries an Aptos account by address
 * @param accountAddress Hex-encoded 16 bytes Aptos account address
 * @returns Core account resource, used for identifying account and transaction execution
 * @example An example of the returned account
 * ```
 * {
 *    sequence_number: "1",
 *    authentication_key: "0x5307b5f4bc67829097a8ba9b43dba3b88261eeccd1f709d9bde240fc100fbb69"
 * }
 * ```
 */
export async function getAccount(
  api: AptosAPI,
  accountAddress: MaybeHexString
): Promise<AccountMetadata> {
  const response = (await api.accounts.getAccount(
    HexString.ensure(accountAddress).hex()
  )) as AptosAPIResponse<AccountMetadata>;
  raiseForStatus(200, response);
  return response.data;
}
