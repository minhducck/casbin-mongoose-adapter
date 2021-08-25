"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinMongooseAdapter = void 0;
var casbin_1 = require("casbin");
var mongoose_1 = require("mongoose");
var object_hash_1 = __importDefault(require("object-hash"));
var CasbinMongooseAdapter = /** @class */ (function () {
    /**
     * Can use with custom initialized Mongoose Connection.
     **/
    function CasbinMongooseAdapter(uri, connectionOptions, collectionName, connection) {
        var _this = this;
        if (collectionName === void 0) { collectionName = 'casbin-rule'; }
        this.policiesStorage = {};
        this.collectionName = 'casbin-rule';
        this.isFiltered = false;
        this.resolveStoreKey = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return object_hash_1.default(JSON.stringify(args));
        };
        this.getDbModel = function (name) {
            return _this.getConnection().model(name);
        };
        this.connection = connection || mongoose_1.createConnection(uri, connectionOptions);
        this.collectionName = collectionName;
    }
    CasbinMongooseAdapter.prototype.addPolicy = function (sec, ptype, rule) {
        return __awaiter(this, void 0, void 0, function () {
            var key, dbDocumentConstructor, dbDocument, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.resolveStoreKey(sec, ptype, rule);
                        if (!(this.policiesStorage[key] === undefined)) return [3 /*break*/, 4];
                        this.policiesStorage[key] = {
                            p_type: ptype,
                            v0: rule[0] || '',
                            v1: rule[1] || '',
                            v2: rule[2] || '',
                            v3: rule[3] || '',
                            v4: rule[4] || '',
                            v5: rule[5] || '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        dbDocumentConstructor = this.getDbModel(this.collectionName);
                        dbDocument = new dbDocumentConstructor(this.policiesStorage[key]);
                        return [4 /*yield*/, dbDocument.save()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        throw err_1;
                    case 4: return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    CasbinMongooseAdapter.prototype.loadPolicy = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.loadFilteredPolicy(model, null)];
            });
        });
    };
    CasbinMongooseAdapter.prototype.removeFilteredPolicy = function (sec, ptype, fieldIndex) {
        var fieldValues = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            fieldValues[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var CasbinRule, where, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        CasbinRule = this.getDbModel(this.collectionName);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        where = ptype ? { p_type: ptype } : {};
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
                        return [4 /*yield*/, CasbinRule.deleteMany(where)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        throw err_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CasbinMongooseAdapter.prototype.removePolicy = function (sec, ptype, rule) {
        return Promise.resolve(undefined);
    };
    CasbinMongooseAdapter.prototype.savePolicy = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            var lines, policyRuleAST, groupingPolicyAST, CasbinRule, _i, policyRuleAST_1, _a, ptype, ast, _b, _c, rule, _d, groupingPolicyAST_1, _e, ptype, ast, _f, _g, rule, _h, err_3;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 3, , 4]);
                        lines = [];
                        policyRuleAST = model.model.get('p') instanceof Map ? model.model.get('p') : new Map();
                        groupingPolicyAST = model.model.get('g') instanceof Map ? model.model.get('g') : new Map();
                        CasbinRule = this.getDbModel(this.collectionName);
                        // @ts-ignore
                        for (_i = 0, policyRuleAST_1 = policyRuleAST; _i < policyRuleAST_1.length; _i++) {
                            _a = policyRuleAST_1[_i], ptype = _a[0], ast = _a[1];
                            for (_b = 0, _c = ast.policy; _b < _c.length; _b++) {
                                rule = _c[_b];
                                lines.push(this.newDbModelLine(ptype, rule));
                            }
                        }
                        // @ts-ignore
                        for (_d = 0, groupingPolicyAST_1 = groupingPolicyAST; _d < groupingPolicyAST_1.length; _d++) {
                            _e = groupingPolicyAST_1[_d], ptype = _e[0], ast = _e[1];
                            for (_f = 0, _g = ast.policy; _f < _g.length; _f++) {
                                rule = _g[_f];
                                lines.push(this.newDbModelLine(ptype, rule));
                            }
                        }
                        _h = lines.length;
                        if (!_h) return [3 /*break*/, 2];
                        return [4 /*yield*/, CasbinRule.collection.insertMany(lines)];
                    case 1:
                        _h = (_j.sent());
                        _j.label = 2;
                    case 2:
                        _h;
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _j.sent();
                        console.error(err_3);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    CasbinMongooseAdapter.prototype.loadFilteredPolicy = function (model, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var dbModel, lines, _i, lines_1, line;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbModel = this.getDbModel(this.collectionName);
                        return [4 /*yield*/, dbModel.find(filter || {}).exec()];
                    case 1:
                        lines = _a.sent();
                        for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                            line = lines_1[_i];
                            this.loadPolicyLine(line.toObject(), model);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CasbinMongooseAdapter.prototype.getConnection = function () {
        if (!this.connection) {
            throw new Error("Connection has not initialized");
        }
        return this.connection;
    };
    CasbinMongooseAdapter.prototype.loadPolicyLine = function (line, model) {
        var lineText = [line.p_type, line.v0, line.v1, line.v2, line.v3, line.v4, line.v5].join(',');
        casbin_1.Helper.loadPolicyLine(lineText, model);
    };
    CasbinMongooseAdapter.prototype.newDbModelLine = function (ptype, rule) {
        var dbModelConstructor = this.getDbModel(this.collectionName);
        return new dbModelConstructor({
            p_type: ptype,
            v0: rule[0] || '',
            v1: rule[1] || '',
            v2: rule[2] || '',
            v3: rule[3] || '',
            v4: rule[4] || '',
            v5: rule[5] || '',
        });
    };
    return CasbinMongooseAdapter;
}());
exports.CasbinMongooseAdapter = CasbinMongooseAdapter;
