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
import { Decimal, InstantiateMsg, ExecuteMsg, Uint128, AssetInfoBaseForString, AssetBaseForString, QueryMsg, MigrateMsg, StateResponse } from "./Etf.types";
export interface EtfMsg {
  contractAddress: string;
  sender: string;
  provideLiquidity: ({
    asset
  }: {
    asset: AssetBaseForString;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
  setFee: ({
    fee
  }: {
    fee: Decimal;
  }, funds_?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class EtfMsgComposer implements EtfMsg {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.provideLiquidity = this.provideLiquidity.bind(this);
    this.setFee = this.setFee.bind(this);
  }

  provideLiquidity = ({
    asset
  }: {
    asset: AssetBaseForString;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      provide_liquidity: {
        asset
      }
    };
    const moduleMsg: AppExecuteMsg<ExecuteMsg> = AppExecuteMsgFactory.executeApp(msg);
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(moduleMsg)),
        funds: funds_
      })
    };
  };
  setFee = ({
    fee
  }: {
    fee: Decimal;
  }, funds_?: Coin[]): MsgExecuteContractEncodeObject => {
    const msg = {
      set_fee: {
        fee
      }
    };
    const moduleMsg: AppExecuteMsg<ExecuteMsg> = AppExecuteMsgFactory.executeApp(msg);
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify(moduleMsg)),
        funds: funds_
      })
    };
  };
}