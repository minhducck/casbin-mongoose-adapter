import { Document, Model } from "mongoose";
export interface ICasbinRule {
    p_type?: string;
    v0?: string;
    v1?: string;
    v2?: string;
    v3?: string;
    v4?: string;
    v5?: string;
}
export interface ICasbinRuleDocument extends Document<ICasbinRule>, ICasbinRule {
}
export interface ICasbinRuleModel extends Model<Document<ICasbinRule>> {
}
