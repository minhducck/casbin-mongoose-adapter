"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinRuleSchema = exports.CasbinRuleMongooseSchemaDeclaration = void 0;
var mongoose_1 = require("mongoose");
var Types = mongoose_1.Schema.Types;
exports.CasbinRuleMongooseSchemaDeclaration = {
    p_type: {
        type: Types.String,
        required: true,
        index: true
    },
    v0: {
        type: Types.String,
        index: true
    },
    v1: {
        type: Types.String,
        index: true
    },
    v2: {
        type: Types.String,
        index: true
    },
    v3: {
        type: Types.String,
        index: true
    },
    v4: {
        type: Types.String,
        index: true
    },
    v5: {
        type: Types.String,
        index: true
    }
};
exports.CasbinRuleSchema = new mongoose_1.Schema(exports.CasbinRuleMongooseSchemaDeclaration, {
    collection: 'CasbinRule',
    minimize: false,
    timestamps: false
});
