"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinMongooseAdapter = void 0;
const casbin_1 = require("casbin");
const mongoose_1 = require("mongoose");
const objectHash = require('object-hash');
class CasbinMongooseAdapter {
    /**
     * Can use with custom initialized Mongoose Connection.
     **/
    constructor(uri, connectionOptions, collectionName = 'casbin-rule', connection) {
        this.policiesStorage = {};
        this.collectionName = 'casbin-rule';
        this.resolveStoreKey = (...args) => objectHash.hash(args);
        this.getDbModel = (name) => this.getConnection().model(name);
        this.connection = connection || mongoose_1.createConnection(uri, connectionOptions);
        this.collectionName = collectionName;
    }
    async addPolicy(sec, ptype, rule) {
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
                const dbDocumentConstructor = this.getDbModel(this.collectionName);
                const dbDocument = new dbDocumentConstructor(this.policiesStorage[key]);
                await dbDocument.save();
            }
            catch (err) {
                throw err;
            }
        }
        return Promise.resolve();
    }
    async loadPolicy(model) {
        return this.loadFilteredPolicy(model, null);
    }
    async removeFilteredPolicy(sec, ptype, fieldIndex, ...fieldValues) {
        const CasbinRule = this.getDbModel(this.collectionName);
        try {
            const where = ptype ? { p_type: ptype } : {};
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
        }
        catch (err) {
            throw err;
        }
    }
    removePolicy(sec, ptype, rule) {
        return Promise.resolve(undefined);
    }
    async savePolicy(model) {
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
            await CasbinRule.collection.insertMany(lines);
        }
        catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }
    async loadFilteredPolicy(model, filter) {
        const dbModel = this.getDbModel(this.collectionName);
        const lines = await dbModel.find(filter || {}).exec();
        for (const line of lines) {
            this.loadPolicyLine(line.toObject(), model);
        }
    }
    getConnection() {
        if (!this.connection) {
            throw new Error("Connection has not initialized");
        }
        return this.connection;
    }
    loadPolicyLine(line, model) {
        const lineText = [line.p_type, line.v0, line.v1, line.v2, line.v3, line.v4, line.v5].join(',');
        casbin_1.Helper.loadPolicyLine(lineText, model);
    }
    newDbModelLine(ptype, rule) {
        const dbModelConstructor = this.getConnection().model(this.collectionName);
        return new dbModelConstructor({
            p_type: ptype,
            v0: rule[0] || '',
            v1: rule[1] || '',
            v2: rule[2] || '',
            v3: rule[3] || '',
            v4: rule[4] || '',
            v5: rule[5] || '',
        });
    }
}
exports.CasbinMongooseAdapter = CasbinMongooseAdapter;
