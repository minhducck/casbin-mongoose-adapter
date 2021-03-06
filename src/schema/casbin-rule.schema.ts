import {Document, model, Schema} from "mongoose"
const Types = Schema.Types
export const CasbinRuleMongooseSchemaDeclaration = {
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
}

export const CasbinRuleSchema = new Schema(
  CasbinRuleMongooseSchemaDeclaration, {
  collection: 'CasbinRule',
  minimize: false,
  timestamps: false
});
