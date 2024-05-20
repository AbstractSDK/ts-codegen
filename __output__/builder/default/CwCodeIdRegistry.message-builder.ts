/**
* This file was automatically generated by @abstract-money/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { Addr, PaymentInfo, Uint128, ConfigResponse, ExecuteMsg, Binary, Cw20ReceiveMsg, GetRegistrationResponse, Registration, InfoForCodeIdResponse, InstantiateMsg, ListRegistrationsResponse, QueryMsg, ReceiveMsg } from "./CwCodeIdRegistry.types";
import { CamelCasedProperties } from "type-fest";
export abstract class CwCodeIdRegistryExecuteMsgBuilder {
  static receive = ({
    amount,
    msg,
    sender
  }: CamelCasedProperties<Extract<ExecuteMsg, {
    receive: unknown;
  }>["receive"]>): ExecuteMsg => {
    return {
      receive: ({
        amount,
        msg,
        sender
      } as const)
    };
  };
  static register = ({
    chainId,
    checksum,
    codeId,
    name,
    version
  }: CamelCasedProperties<Extract<ExecuteMsg, {
    register: unknown;
  }>["register"]>): ExecuteMsg => {
    return {
      register: ({
        chain_id: chainId,
        checksum,
        code_id: codeId,
        name,
        version
      } as const)
    };
  };
  static setOwner = ({
    chainId,
    name,
    owner
  }: CamelCasedProperties<Extract<ExecuteMsg, {
    set_owner: unknown;
  }>["set_owner"]>): ExecuteMsg => {
    return {
      set_owner: ({
        chain_id: chainId,
        name,
        owner
      } as const)
    };
  };
  static unregister = ({
    chainId,
    codeId
  }: CamelCasedProperties<Extract<ExecuteMsg, {
    unregister: unknown;
  }>["unregister"]>): ExecuteMsg => {
    return {
      unregister: ({
        chain_id: chainId,
        code_id: codeId
      } as const)
    };
  };
  static updateConfig = ({
    admin,
    paymentInfo
  }: CamelCasedProperties<Extract<ExecuteMsg, {
    update_config: unknown;
  }>["update_config"]>): ExecuteMsg => {
    return {
      update_config: ({
        admin,
        payment_info: paymentInfo
      } as const)
    };
  };
}
export abstract class CwCodeIdRegistryQueryMsgBuilder {
  static config = (): QueryMsg => {
    return {
      config: ({} as const)
    };
  };
  static getRegistration = ({
    chainId,
    name,
    version
  }: CamelCasedProperties<Extract<QueryMsg, {
    get_registration: unknown;
  }>["get_registration"]>): QueryMsg => {
    return {
      get_registration: ({
        chain_id: chainId,
        name,
        version
      } as const)
    };
  };
  static infoForCodeId = ({
    chainId,
    codeId
  }: CamelCasedProperties<Extract<QueryMsg, {
    info_for_code_id: unknown;
  }>["info_for_code_id"]>): QueryMsg => {
    return {
      info_for_code_id: ({
        chain_id: chainId,
        code_id: codeId
      } as const)
    };
  };
  static listRegistrations = ({
    chainId,
    name
  }: CamelCasedProperties<Extract<QueryMsg, {
    list_registrations: unknown;
  }>["list_registrations"]>): QueryMsg => {
    return {
      list_registrations: ({
        chain_id: chainId,
        name
      } as const)
    };
  };
}