/**
* This file was automatically generated by @abstract-money/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

export type AdminAddrResponse = string;
export type CodeIdResponse = number;
export type CodeIdType = "Proxy" | "Multisig";
export type Uint128 = string;
export type Binary = string;
export interface CreateWalletMsg {
  guardians: Guardians;
  label: string;
  proxy_initial_funds: Coin[];
  relayers: string[];
  user_pubkey: Binary;
  [k: string]: unknown;
}
export interface Guardians {
  addresses: string[];
  guardians_multisig?: MultiSig | null;
  [k: string]: unknown;
}
export interface MultiSig {
  multisig_initial_funds: Coin[];
  threshold_absolute_count: number;
  [k: string]: unknown;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export interface Cw20Coin {
  address: string;
  amount: Uint128;
  [k: string]: unknown;
}
export type ExecuteMsg = {
  create_wallet: {
    create_wallet_msg: CreateWalletMsg;
    [k: string]: unknown;
  };
} | {
  update_proxy_user: {
    new_user: Addr;
    old_user: Addr;
    [k: string]: unknown;
  };
} | {
  migrate_wallet: {
    migration_msg: ProxyMigrationTxMsg;
    wallet_address: WalletAddr;
    [k: string]: unknown;
  };
} | {
  update_code_id: {
    new_code_id: number;
    ty: CodeIdType;
    [k: string]: unknown;
  };
} | {
  update_wallet_fee: {
    new_fee: Coin;
    [k: string]: unknown;
  };
} | {
  update_govec_addr: {
    addr: string;
    [k: string]: unknown;
  };
} | {
  update_admin: {
    addr: string;
    [k: string]: unknown;
  };
};
export type Addr = string;
export type ProxyMigrationTxMsg = {
  RelayTx: RelayTransaction;
} | {
  DirectMigrationMsg: Binary;
};
export type WalletAddr = {
  Canonical: CanonicalAddr;
} | {
  Addr: Addr;
};
export type CanonicalAddr = string;
export interface RelayTransaction {
  message: Binary;
  nonce: number;
  signature: Binary;
  user_pubkey: Binary;
  [k: string]: unknown;
}
export interface FeeResponse {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export type GovecAddrResponse = string;
export interface InstantiateMsg {
  addr_prefix: string;
  govec?: string | null;
  proxy_code_id: number;
  proxy_multisig_code_id: number;
  wallet_fee: Coin;
  [k: string]: unknown;
}
export type QueryMsg = {
  wallets: {
    limit?: number | null;
    start_after?: WalletQueryPrefix | null;
    [k: string]: unknown;
  };
} | {
  wallets_of: {
    limit?: number | null;
    start_after?: string | null;
    user: string;
    [k: string]: unknown;
  };
} | {
  code_id: {
    ty: CodeIdType;
    [k: string]: unknown;
  };
} | {
  fee: {
    [k: string]: unknown;
  };
} | {
  govec_addr: {
    [k: string]: unknown;
  };
} | {
  admin_addr: {
    [k: string]: unknown;
  };
};
export interface WalletQueryPrefix {
  user_addr: string;
  wallet_addr: string;
  [k: string]: unknown;
}
export type Duration = {
  height: number;
} | {
  time: number;
};
export interface StakingOptions {
  code_id: number;
  duration?: Duration | null;
  [k: string]: unknown;
}
export interface WalletInfo {
  code_id: number;
  guardians: Addr[];
  is_frozen: boolean;
  label: string;
  multisig_address?: Addr | null;
  multisig_code_id: number;
  nonce: number;
  relayers: Addr[];
  user_addr: Addr;
  version: ContractVersion;
  [k: string]: unknown;
}
export interface ContractVersion {
  contract: string;
  version: string;
  [k: string]: unknown;
}
export interface WalletsOfResponse {
  wallets: Addr[];
  [k: string]: unknown;
}
export interface WalletsResponse {
  wallets: Addr[];
  [k: string]: unknown;
}