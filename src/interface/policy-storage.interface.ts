import {ICasbinRule} from "./casbin-rule.interface";

export interface IPolicyStorage {
  [key: string]: ICasbinRule
}