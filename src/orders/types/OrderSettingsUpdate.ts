/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderSettingsUpdateInput, OrderSettingsErrorCode, ShopErrorCode, ShopSettingsInput } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: OrderSettingsUpdate
// ====================================================

export interface OrderSettingsUpdate_orderSettingsUpdate_errors {
  __typename: "OrderSettingsError";
  code: OrderSettingsErrorCode;
  field: string | null;
}

export interface OrderSettingsUpdate_orderSettingsUpdate_orderSettings {
  __typename: "OrderSettings";
  automaticallyConfirmAllNewOrders: boolean;
}

export interface OrderSettingsUpdate_orderSettingsUpdate {
  __typename: "OrderSettingsUpdate";
  errors: OrderSettingsUpdate_orderSettingsUpdate_errors[];
  orderSettings: OrderSettingsUpdate_orderSettingsUpdate_orderSettings | null;
}

export interface OrderSettingsUpdate_shopSettingsUpdate_errors {
  __typename: "ShopError";
  code: ShopErrorCode;
  field: string | null;
}

export interface OrderSettingsUpdate_shopSettingsUpdate_shop {
  __typename: "Shop";
  fulfillmentAutoConfirm: boolean;
  fulfillmentAllowUnpaid: boolean;
}

export interface OrderSettingsUpdate_shopSettingsUpdate {
  __typename: "OrderSettingsUpdate";
  errors: OrderSettingsUpdate_shopSettingsUpdate_errors[];
  orderSettings: OrderSettingsUpdate_shopSettingsUpdate_shop | null;
}

export interface OrderSettingsUpdate {
  orderSettingsUpdate: OrderSettingsUpdate_orderSettingsUpdate | null;
  shopSettingsUpdate: OrderSettingsUpdate_shopSettingsUpdate | null;
}

export interface OrderSettingsUpdateVariables {
  orderSettingsInput: OrderSettingsUpdateInput;
  shopSettingsInput: ShopSettingsInput;
}
