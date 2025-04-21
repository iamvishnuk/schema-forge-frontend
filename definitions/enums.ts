/* eslint-disable no-unused-vars */

export enum TeamRoleEnum {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export enum InviteTeamRoleEnum {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export enum MemberStatusEnum {
  ACTIVE = 'active',
  PENDING = 'pending',
  INVITED = 'invited',
  SUSPENDED = 'suspended'
}

export enum ProjectDataBaseTypeEnum {
  MYSQL = 'mysql',
  POSTGRESQL = 'postgresql',
  MONGODB = 'mongodb',
  SQLITE = 'sqlite'
}
