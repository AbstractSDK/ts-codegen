/**
* This file was automatically generated by @abstract-money/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { AppExecuteMsg, AppExecuteMsgFactory } from "@abstract-money/core";
import { Addr, PaymentInfo, Uint128, ConfigResponse, ExecuteMsg, Binary, Cw20ReceiveMsg, GetRegistrationResponse, Registration, InfoForCodeIdResponse, InstantiateMsg, ListRegistrationsResponse, QueryMsg, ReceiveMsg } from "./CwCodeIdRegistry.types";
export interface CwCodeIdRegistryMsg {
  contractAddress: string;
  sender: string;
  receive: ({
    amount,
    msg,
    sender
  }: {
    amount: Uint128;
    msg: Binary;
    sender: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  register: ({
    chainId,
    checksum,
    codeId,
    name,
    version
  }: {
    chainId: string;
    checksum: string;
    codeId: number;
    name: string;
    version: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  setOwner: ({
    chainId,
    name,
    owner
  }: {
    chainId: string;
    name: string;
    owner?: string;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  unregister: ({
    chainId,
    codeId
  }: {
    chainId: string;
    codeId: number;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  updateConfig: ({
    admin,
    paymentInfo
  }: {
    admin?: string;
    paymentInfo?: PaymentInfo;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class CwCodeIdRegistryMsgComposer implements CwCodeIdRegistryMsg {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.receive = this.receive.bind(this);
    this.register = this.register.bind(this);
    this.setOwner = this.setOwner.bind(this);
    this.unregister = this.unregister.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
  }

  receive = ({
    amount,
    msg,
    sender
  }: {
    amount: Uint128;
    msg: Binary;
    sender: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      receive: {
        amount,
        msg,
        sender
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: funds_
      })
    };
  };
  register = ({
    chainId,
    checksum,
    codeId,
    name,
    version
  }: {
    chainId: string;
    checksum: string;
    codeId: number;
    name: string;
    version: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      register: {
        chain_id: chainId,
        checksum,
        code_id: codeId,
        name,
        version
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: funds_
      })
    };
  };
  setOwner = ({
    chainId,
    name,
    owner
  }: {
    chainId: string;
    name: string;
    owner?: string;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      set_owner: {
        chain_id: chainId,
        name,
        owner
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: funds_
      })
    };
  };
  unregister = ({
    chainId,
    codeId
  }: {
    chainId: string;
    codeId: number;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      unregister: {
        chain_id: chainId,
        code_id: codeId
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: funds_
      })
    };
  };
  updateConfig = ({
    admin,
    paymentInfo
  }: {
    admin?: string;
    paymentInfo?: PaymentInfo;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      update_config: {
        admin,
        payment_info: paymentInfo
      }
    };
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(msg)),
        funds: funds_
      })
    };
  };
}