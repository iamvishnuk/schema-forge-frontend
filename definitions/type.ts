import {
  DATABASE_TYPE_OPTIONS,
  MONGO_DB_ORM_OPTIONS,
  POSTGRESQL_ORM_OPTIONS
} from '@/lib/constant';

export type TDatabaseTypeValue =
  (typeof DATABASE_TYPE_OPTIONS)[number]['value'];

export type TMongoORM = typeof MONGO_DB_ORM_OPTIONS;
export type TPostgresqlORM = typeof POSTGRESQL_ORM_OPTIONS;
