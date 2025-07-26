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

export const POSTGRESQL_DATA_TYPES = [
  { label: 'VARCHAR', value: 'VARCHAR' },
  { label: 'TEXT', value: 'TEXT' },
  { label: 'CHAR', value: 'CHAR' },
  { label: 'INTEGER', value: 'INTEGER' },
  { label: 'BIGINT', value: 'BIGINT' },
  { label: 'SMALLINT', value: 'SMALLINT' },
  { label: 'DECIMAL', value: 'DECIMAL' },
  { label: 'NUMERIC', value: 'NUMERIC' },
  { label: 'REAL', value: 'REAL' },
  { label: 'DOUBLE PRECISION', value: 'DOUBLE PRECISION' },
  { label: 'SERIAL', value: 'SERIAL' },
  { label: 'BIGSERIAL', value: 'BIGSERIAL' },
  { label: 'BOOLEAN', value: 'BOOLEAN' },
  { label: 'DATE', value: 'DATE' },
  { label: 'TIME', value: 'TIME' },
  { label: 'TIMESTAMP', value: 'TIMESTAMP' },
  { label: 'TIMESTAMPTZ', value: 'TIMESTAMPTZ' },
  { label: 'INTERVAL', value: 'INTERVAL' },
  { label: 'UUID', value: 'UUID' },
  { label: 'JSON', value: 'JSON' },
  { label: 'JSONB', value: 'JSONB' },
  { label: 'ARRAY', value: 'ARRAY' },
  { label: 'BYTEA', value: 'BYTEA' },
  { label: 'INET', value: 'INET' },
  { label: 'CIDR', value: 'CIDR' },
  { label: 'MACADDR', value: 'MACADDR' },
  { label: 'POINT', value: 'POINT' },
  { label: 'LINE', value: 'LINE' },
  { label: 'POLYGON', value: 'POLYGON' },
  { label: 'CIRCLE', value: 'CIRCLE' },
  { label: 'MONEY', value: 'MONEY' }
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
