/**
* This file was automatically generated by @abstract-money/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @abstract-money/ts-codegen generate command to regenerate this file.
*/

import { UseQueryOptions } from "@tanstack/react-query";
import { ExecuteMsg, Binary, InstantiateMsg, QueryMsg } from "./CwAdminFactory.types";
import { CwAdminFactoryQueryClient } from "./CwAdminFactory.client";
export interface CwAdminFactoryReactQuery<TResponse, TData = TResponse> {
  client: CwAdminFactoryQueryClient;
  options?: Omit<UseQueryOptions<TResponse, Error, TData>, "'queryKey' | 'queryFn' | 'initialData'"> & {
    initialData?: undefined;
  };
}