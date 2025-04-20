export const MONGO_DATA_TYPES = [
  { label: 'String', value: 'String' },
  { label: 'Number', value: 'Number' },
  { label: 'Date', value: 'Date' },
  { label: 'Buffer', value: 'Buffer' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'Mixed', value: 'Mixed' },
  { label: 'ObjectId', value: 'ObjectId' },
  { label: 'Array', value: 'Array' },
  { label: 'Decimal128', value: 'Decimal128' },
  { label: 'Map', value: 'Map' },
  { label: 'Schema', value: 'Schema' },
  { label: 'UUID', value: 'UUID' },
  { label: 'BigInt', value: 'BigInt' }
] as const;

export const MONGO_COMMON_SCHEMA_OPTIONS = [
  { label: 'Required', value: 'required', type: 'boolean', shortForm: 'R' },
  { label: 'Unique', value: 'unique', type: 'boolean', shortForm: 'U' },
  { label: 'Index', value: 'index', type: 'boolean', shortForm: 'I' }
  // { label: 'Default Value', value: 'default', type: 'dynamic' },
  // { label: 'Sparse', value: 'sparse', type: 'boolean' },
  // { label: 'Immutable', value: 'immutable', type: 'boolean' },
  // { label: 'Validator', value: 'validate', type: 'function' },
  // { label: 'Get', value: 'get', type: 'function' },
  // { label: 'Set', value: 'set', type: 'function' }
] as const;

export const EDGE_TYPES = [
  { label: 'Bezier', value: 'default' },
  { label: 'Straight', value: 'straight' },
  { label: 'Step', value: 'step' },
  { label: 'Smooth Step', value: 'smoothstep' },
  { label: 'Simple Bezier', value: 'simplebezier' }
] as const;
