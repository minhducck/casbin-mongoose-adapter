import {Adapter, Helper, Model} from "casbin";
import {IPolicyStorage} from "./interface/policy-storage.interface";
import {
  Connection as MongooseConnection,
  ConnectOptions,
  createConnection,
  FilterQuery
} from "mongoose";
import {
  ICasbinRule,
  ICasbinRuleDocument, ICasbinRuleModel
} from "./interface/casbin-rule.interface";
import {CasbinRuleSchema} from "./schema/casbin-rule.schema";
import objectHash from 'object-hash'

export class CasbinMongooseAdapter implements Adapter {
  protected policiesStorage: IPolicyStorage = {};
  private readonly connection: MongooseConnection | null;
  private readonly collectionName: string = 'casbin-rule';

  /**
   * Can use with custom initialized Mongoose Connection.
   **/
  constructor(
    uri: string,
    connectionOptions: ConnectOptions,
    collectionName: string = 'casbin-rule',
    connection: MongooseConnection | null
  ) {
    this.connection = connection || createConnection(uri, connectionOptions);
    this.collectionName = collectionName;
  }

  private resolveStoreKey = (...args: any[]): string => objectHash(args);

  async addPolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    console.log(sec, ptype, rule);
    const key = this.resolveStoreKey(sec, ptype, rule);

    if (this.policiesStorage[key] === undefined) {
      this.policiesStorage[key] = {
        p_type: ptype,
        v0: rule[0] || '',
        v1: rule[1] || '',
        v2: rule[2] || '',
        v3: rule[3] || '',
        v4: rule[4] || '',
        v5: rule[5] || '',
      };

      try {
        const dbDocumentConstructor: ICasbinRuleModel = this.getDbModel(this.collectionName)
        const dbDocument = new dbDocumentConstructor(this.policiesStorage[key]);
        await dbDocument.save();

      } catch (err) {
        throw err;
      }
    }

    return Promise.resolve();
  }

  async loadPolicy(model: Model) {
    return this.loadFilteredPolicy(model, null);
  }

  async removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void> {
    const CasbinRule = this.getDbModel(this.collectionName);

    try {
      const where: ICasbinRule = ptype ? {p_type: ptype} : {};

      if (fieldIndex <= 0 && fieldIndex + fieldValues.length > 0 && fieldValues[0 - fieldIndex]) {
        where.v0 = fieldValues[0 - fieldIndex];
      }

      if (fieldIndex <= 1 && fieldIndex + fieldValues.length > 1 && fieldValues[1 - fieldIndex]) {
        where.v1 = fieldValues[1 - fieldIndex];
      }

      if (fieldIndex <= 2 && fieldIndex + fieldValues.length > 2 && fieldValues[2 - fieldIndex]) {
        where.v2 = fieldValues[2 - fieldIndex];
      }

      if (fieldIndex <= 3 && fieldIndex + fieldValues.length > 3 && fieldValues[3 - fieldIndex]) {
        where.v3 = fieldValues[3 - fieldIndex];
      }

      if (fieldIndex <= 4 && fieldIndex + fieldValues.length > 4 && fieldValues[4 - fieldIndex]) {
        where.v4 = fieldValues[4 - fieldIndex];
      }

      if (fieldIndex <= 5 && fieldIndex + fieldValues.length > 5 && fieldValues[5 - fieldIndex]) {
        where.v5 = fieldValues[5 - fieldIndex];
      }

      await CasbinRule.deleteMany(where);
    } catch (err) {
      throw err;
    }
  }

  removePolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    return Promise.resolve(undefined);
  }

  async savePolicy(model: Model): Promise<boolean> {
    try {
      const lines = [];
      const policyRuleAST = model.model.get('p') instanceof Map ? model.model.get('p') : new Map();
      const groupingPolicyAST = model.model.get('g') instanceof Map ? model.model.get('g') : new Map();
      const CasbinRule = this.getDbModel(this.collectionName);

      // @ts-ignore
      for (const [ptype, ast] of policyRuleAST) {
        for (const rule of ast.policy) {
          lines.push(this.newDbModelLine(ptype, rule));
        }
      }

      // @ts-ignore
      for (const [ptype, ast] of groupingPolicyAST) {
        for (const rule of ast.policy) {
          lines.push(this.newDbModelLine(ptype, rule));
        }
      }

      console.log(lines);

      lines.length && await CasbinRule.collection.insertMany(lines);

    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
  }

  async loadFilteredPolicy(model: Model, filter: FilterQuery<ICasbinRuleDocument> | null) {
    const dbModel = this.getDbModel(this.collectionName);

    const lines = await dbModel.find(filter || {}).exec();

    for (const line of lines) {
      this.loadPolicyLine(line.toObject<ICasbinRule>(), model);
    }
  }

  private getConnection(): MongooseConnection {
    if (!this.connection) {
      throw new Error("Connection has not initialized");
    }

    return this.connection;
  }

  loadPolicyLine(line: ICasbinRule, model: Model) {
    const lineText = [line.p_type, line.v0, line.v1, line.v2, line.v3, line.v4, line.v5].join(',');
    Helper.loadPolicyLine(lineText, model);
  }

  private newDbModelLine(ptype: any, rule: string[]) {
    const dbModelConstructor = this.getDbModel(this.collectionName);
    return new dbModelConstructor({
      p_type: ptype,
      v0: rule[0] || '',
      v1: rule[1] || '',
      v2: rule[2] || '',
      v3: rule[3] || '',
      v4: rule[4] || '',
      v5: rule[5] || '',
    } as ICasbinRule)
  }

  private getDbModel = (name: string): ICasbinRuleModel => {
    return this.getConnection().model(name);
  }
}