import { Adapter, Model } from "casbin";
import { IPolicyStorage } from "./interface/policy-storage.interface";
import { Connection as MongooseConnection, ConnectOptions, FilterQuery } from "mongoose";
import { ICasbinRule, ICasbinRuleDocument } from "./interface/casbin-rule.interface";
export declare class CasbinMongooseAdapter implements Adapter {
    protected policiesStorage: IPolicyStorage;
    private readonly connection;
    private readonly collectionName;
    isFiltered: boolean;
    private cachedLines;
    /**
     * Can use with custom initialized Mongoose Connection.
     **/
    constructor(uri: string, connectionOptions: ConnectOptions, collectionName: string | undefined, connection: MongooseConnection | null);
    private resolveStoreKey;
    private addToCacheStorageIfNotExist;
    addPolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    addPolicies: (sec: string, ptype: string, rules: string[][]) => Promise<import("mongoose").Document<ICasbinRule, any>[]>;
    loadPolicy(model: Model): Promise<void>;
    removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void>;
    removePolicy(sec: string, ptype: string, rule: string[]): Promise<void>;
    savePolicy(model: Model): Promise<boolean>;
    loadFilteredPolicy(model: Model, filter: FilterQuery<ICasbinRuleDocument> | null): Promise<void>;
    private getConnection;
    loadPolicyLine(line: ICasbinRule, model: Model): void;
    private newDbModelLine;
    private getDbModel;
}
