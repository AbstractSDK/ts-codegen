/**
* This file was automatically generated by cosmwasm-typescript-gen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the cosmwasm-typescript-gen generate command to regenerate this file.
*/

import { selectorFamily } from "recoil";
import { cosmWasmClient } from "./chain";
import { DumpResponse, Group, ExecuteMsg, InstantiateMsg, Addr, ListAddressesResponse, ListGroupsResponse, QueryMsg } from "./CwNamedGroupsContract";
import { CwNamedGroupsQueryClient } from "./CwNamedGroupsContract.ts";
type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<CwNamedGroupsQueryClient | undefined, QueryClientParams>({
  key: "cwNamedGroupsQueryClient",
  get: ({
    contractAddress
  }) => ({
    get
  }) => {
    const client = get(cosmWasmClient);
    if (!client) return;
    return new CwNamedGroupsQueryClient(client, contractAddress);
  }
});
export const dumpSelector = selectorFamily<DumpResponse | undefined, QueryClientParams & {
  params: Parameters<CwNamedGroupsQueryClient["dump"]>;
}>({
  key: "cwNamedGroupsDump",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    if (!client) return;
    return await client.dump(...params);
  }
});
export const listGroupsSelector = selectorFamily<ListGroupsResponse | undefined, QueryClientParams & {
  params: Parameters<CwNamedGroupsQueryClient["listGroups"]>;
}>({
  key: "cwNamedGroupsListGroups",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    if (!client) return;
    return await client.listGroups(...params);
  }
});
export const listAddressesSelector = selectorFamily<ListAddressesResponse | undefined, QueryClientParams & {
  params: Parameters<CwNamedGroupsQueryClient["listAddresses"]>;
}>({
  key: "cwNamedGroupsListAddresses",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    if (!client) return;
    return await client.listAddresses(...params);
  }
});
export const isAddressInGroupSelector = selectorFamily<IsAddressInGroupResponse | undefined, QueryClientParams & {
  params: Parameters<CwNamedGroupsQueryClient["isAddressInGroup"]>;
}>({
  key: "cwNamedGroupsIsAddressInGroup",
  get: ({
    params,
    ...queryClientParams
  }) => async ({
    get
  }) => {
    const client = get(queryClient(queryClientParams));
    if (!client) return;
    return await client.isAddressInGroup(...params);
  }
});