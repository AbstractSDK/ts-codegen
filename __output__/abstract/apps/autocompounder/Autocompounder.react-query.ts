/**
* This file was automatically generated by @abstract-money/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { UseQueryOptions, useQuery, useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee, Coin } from "@cosmjs/amino";
import { Decimal, AssetEntry, BondingPeriodSelector, Duration, InstantiateMsg, ExecuteMsg, Uint128, AnsAsset, QueryMsg, MigrateMsg, Expiration, Timestamp, Uint64, ArrayOfTupleOfStringAndArrayOfClaim, Claim, ArrayOfClaim, Addr, PoolAddressBaseForAddr, AssetInfoBaseForAddr, PoolType, Config, PoolMetadata } from "./Autocompounder.types";
import { AutocompounderAppQueryClient, AutocompounderAppClient } from "./Autocompounder.client";
export const autocompounderQueryKeys = {
  contract: ([{
    contract: "autocompounder"
  }] as const),
  address: (contractAddress: string) => ([{ ...autocompounderQueryKeys.contract[0],
    address: contractAddress
  }] as const),
  config: (contractAddress: string, args?: Record<string, unknown>) => ([{ ...autocompounderQueryKeys.address(contractAddress)[0],
    method: "config",
    args
  }] as const),
  pendingClaims: (contractAddress: string, args?: Record<string, unknown>) => ([{ ...autocompounderQueryKeys.address(contractAddress)[0],
    method: "pending_claims",
    args
  }] as const),
  claims: (contractAddress: string, args?: Record<string, unknown>) => ([{ ...autocompounderQueryKeys.address(contractAddress)[0],
    method: "claims",
    args
  }] as const),
  allClaims: (contractAddress: string, args?: Record<string, unknown>) => ([{ ...autocompounderQueryKeys.address(contractAddress)[0],
    method: "all_claims",
    args
  }] as const),
  latestUnbonding: (contractAddress: string, args?: Record<string, unknown>) => ([{ ...autocompounderQueryKeys.address(contractAddress)[0],
    method: "latest_unbonding",
    args
  }] as const),
  totalLpPosition: (contractAddress: string, args?: Record<string, unknown>) => ([{ ...autocompounderQueryKeys.address(contractAddress)[0],
    method: "total_lp_position",
    args
  }] as const),
  balance: (contractAddress: string, args?: Record<string, unknown>) => ([{ ...autocompounderQueryKeys.address(contractAddress)[0],
    method: "balance",
    args
  }] as const)
};
export const autocompounderQueries = {
  config: <TData = Config,>({
    client,
    options
  }: AutocompounderConfigQuery<TData>): UseQueryOptions<Config, Error, TData> => ({
    queryKey: autocompounderQueryKeys.config(client?.moduleId),
    queryFn: () => client.config(),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  pendingClaims: <TData = Uint128,>({
    client,
    args,
    options
  }: AutocompounderPendingClaimsQuery<TData>): UseQueryOptions<Uint128, Error, TData> => ({
    queryKey: autocompounderQueryKeys.pendingClaims(client?.moduleId, args),
    queryFn: () => client.pendingClaims({
      address: args.address
    }),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  claims: <TData = ArrayOfClaim,>({
    client,
    args,
    options
  }: AutocompounderClaimsQuery<TData>): UseQueryOptions<ArrayOfClaim, Error, TData> => ({
    queryKey: autocompounderQueryKeys.claims(client?.moduleId, args),
    queryFn: () => client.claims({
      address: args.address
    }),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  allClaims: <TData = ArrayOfTupleOfStringAndArrayOfClaim,>({
    client,
    args,
    options
  }: AutocompounderAllClaimsQuery<TData>): UseQueryOptions<ArrayOfTupleOfStringAndArrayOfClaim, Error, TData> => ({
    queryKey: autocompounderQueryKeys.allClaims(client?.moduleId, args),
    queryFn: () => client.allClaims({
      limit: args.limit,
      startAfter: args.startAfter
    }),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  latestUnbonding: <TData = Expiration,>({
    client,
    options
  }: AutocompounderLatestUnbondingQuery<TData>): UseQueryOptions<Expiration, Error, TData> => ({
    queryKey: autocompounderQueryKeys.latestUnbonding(client?.moduleId),
    queryFn: () => client.latestUnbonding(),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  totalLpPosition: <TData = Uint128,>({
    client,
    options
  }: AutocompounderTotalLpPositionQuery<TData>): UseQueryOptions<Uint128, Error, TData> => ({
    queryKey: autocompounderQueryKeys.totalLpPosition(client?.moduleId),
    queryFn: () => client.totalLpPosition(),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  }),
  balance: <TData = Uint128,>({
    client,
    args,
    options
  }: AutocompounderBalanceQuery<TData>): UseQueryOptions<Uint128, Error, TData> => ({
    queryKey: autocompounderQueryKeys.balance(client?.moduleId, args),
    queryFn: () => client.balance({
      address: args.address
    }),
    ...options,
    enabled: !!client && (options?.enabled != undefined ? options.enabled : true)
  })
};
export interface AutocompounderReactQuery<TResponse, TData = TResponse> {
  client: AutocompounderAppQueryClient;
  options?: Omit<UseQueryOptions<TResponse, Error, TData>, "'queryKey' | 'queryFn' | 'initialData'"> & {
    initialData?: undefined;
  };
}
export interface AutocompounderBalanceQuery<TData> extends AutocompounderReactQuery<Uint128, TData> {
  args: {
    address: string;
  };
}
export function useAutocompounderBalanceQuery<TData = Uint128>({
  client,
  args,
  options
}: AutocompounderBalanceQuery<TData>) {
  return useQuery<Uint128, Error, TData>(autocompounderQueryKeys.balance(client._moduleAddress, args), () => client.balance({
    address: args.address
  }), options);
}
export interface AutocompounderTotalLpPositionQuery<TData> extends AutocompounderReactQuery<Uint128, TData> {}
export function useAutocompounderTotalLpPositionQuery<TData = Uint128>({
  client,
  options
}: AutocompounderTotalLpPositionQuery<TData>) {
  return useQuery<Uint128, Error, TData>(autocompounderQueryKeys.totalLpPosition(client._moduleAddress), () => client.totalLpPosition(), options);
}
export interface AutocompounderLatestUnbondingQuery<TData> extends AutocompounderReactQuery<Expiration, TData> {}
export function useAutocompounderLatestUnbondingQuery<TData = Expiration>({
  client,
  options
}: AutocompounderLatestUnbondingQuery<TData>) {
  return useQuery<Expiration, Error, TData>(autocompounderQueryKeys.latestUnbonding(client._moduleAddress), () => client.latestUnbonding(), options);
}
export interface AutocompounderAllClaimsQuery<TData> extends AutocompounderReactQuery<ArrayOfTupleOfStringAndArrayOfClaim, TData> {
  args: {
    limit?: number;
    startAfter?: string;
  };
}
export function useAutocompounderAllClaimsQuery<TData = ArrayOfTupleOfStringAndArrayOfClaim>({
  client,
  args,
  options
}: AutocompounderAllClaimsQuery<TData>) {
  return useQuery<ArrayOfTupleOfStringAndArrayOfClaim, Error, TData>(autocompounderQueryKeys.allClaims(client._moduleAddress, args), () => client.allClaims({
    limit: args.limit,
    startAfter: args.startAfter
  }), options);
}
export interface AutocompounderClaimsQuery<TData> extends AutocompounderReactQuery<ArrayOfClaim, TData> {
  args: {
    address: string;
  };
}
export function useAutocompounderClaimsQuery<TData = ArrayOfClaim>({
  client,
  args,
  options
}: AutocompounderClaimsQuery<TData>) {
  return useQuery<ArrayOfClaim, Error, TData>(autocompounderQueryKeys.claims(client._moduleAddress, args), () => client.claims({
    address: args.address
  }), options);
}
export interface AutocompounderPendingClaimsQuery<TData> extends AutocompounderReactQuery<Uint128, TData> {
  args: {
    address: string;
  };
}
export function useAutocompounderPendingClaimsQuery<TData = Uint128>({
  client,
  args,
  options
}: AutocompounderPendingClaimsQuery<TData>) {
  return useQuery<Uint128, Error, TData>(autocompounderQueryKeys.pendingClaims(client._moduleAddress, args), () => client.pendingClaims({
    address: args.address
  }), options);
}
export interface AutocompounderConfigQuery<TData> extends AutocompounderReactQuery<Config, TData> {}
export function useAutocompounderConfigQuery<TData = Config>({
  client,
  options
}: AutocompounderConfigQuery<TData>) {
  return useQuery<Config, Error, TData>(autocompounderQueryKeys.config(client._moduleAddress), () => client.config(), options);
}
export interface AutocompounderBatchUnbondMutation {
  client: AutocompounderAppClient;
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useAutocompounderBatchUnbondMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, AutocompounderBatchUnbondMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, AutocompounderBatchUnbondMutation>(({
    client,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.batchUnbond(fee, memo, funds), options);
}
export interface AutocompounderCompoundMutation {
  client: AutocompounderAppClient;
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useAutocompounderCompoundMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, AutocompounderCompoundMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, AutocompounderCompoundMutation>(({
    client,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.compound(fee, memo, funds), options);
}
export interface AutocompounderWithdrawMutation {
  client: AutocompounderAppClient;
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useAutocompounderWithdrawMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, AutocompounderWithdrawMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, AutocompounderWithdrawMutation>(({
    client,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.withdraw(fee, memo, funds), options);
}
export interface AutocompounderDepositMutation {
  client: AutocompounderAppClient;
  msg: {
    funds: AnsAsset[];
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useAutocompounderDepositMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, AutocompounderDepositMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, AutocompounderDepositMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.deposit(msg, fee, memo, funds), options);
}
export interface AutocompounderUpdateFeeConfigMutation {
  client: AutocompounderAppClient;
  msg: {
    deposit?: Decimal;
    performance?: Decimal;
    withdrawal?: Decimal;
  };
  args?: {
    fee?: number | StdFee | "auto";
    memo?: string;
    funds?: Coin[];
  };
}
export function useAutocompounderUpdateFeeConfigMutation(options?: Omit<UseMutationOptions<ExecuteResult, Error, AutocompounderUpdateFeeConfigMutation>, "mutationFn">) {
  return useMutation<ExecuteResult, Error, AutocompounderUpdateFeeConfigMutation>(({
    client,
    msg,
    args: {
      fee,
      memo,
      funds
    } = {}
  }) => client.updateFeeConfig(msg, fee, memo, funds), options);
}