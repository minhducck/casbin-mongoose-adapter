import { Document, Schema } from "mongoose";
export declare const CasbinRuleMongooseSchemaDeclaration: {
    p_type: {
        type: typeof Schema.Types.String;
        required: boolean;
        index: boolean;
    };
    v0: {
        type: typeof Schema.Types.String;
        index: boolean;
    };
    v1: {
        type: typeof Schema.Types.String;
        index: boolean;
    };
    v2: {
        type: typeof Schema.Types.String;
        index: boolean;
    };
    v3: {
        type: typeof Schema.Types.String;
        index: boolean;
    };
    v4: {
        type: typeof Schema.Types.String;
        index: boolean;
    };
    v5: {
        type: typeof Schema.Types.String;
        index: boolean;
    };
};
export declare const CasbinRuleSchema: Schema<Document<any, any>, import("mongoose").Model<any, any, any>, undefined, any>;
