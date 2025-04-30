import {
  InviteTeamRoleEnum,
  MemberStatusEnum,
  ProjectDataBaseTypeEnum,
  ProjectMemberRoleEnum,
  TeamRoleEnum
} from './enums';

export interface APIResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  mfaRequired: boolean;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IForgotPasswordSendEmail {
  email: string;
}

export interface IResetPassword {
  password: string;
  code: string;
}

export interface IVerifyMfa {
  code: string;
  secretKey: string;
}

export interface ISetUpMfaRes {
  secret: string;
  qrImageUrl: string;
}

export interface IVerifyMfaAndLogin {
  code: string;
  email: string;
}

export interface ISession {
  _id: string;
  userAgent: string;
  userId: string;
  createdAt: Date;
  expiredAt: Date;
  isCurrent: boolean;
}

export type userPreferences = {
  enable2FA: boolean;
  emailNotification: boolean;
  _id: string;
  twoFactorSecret?: string;
};

export interface IUser {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  userPreferences: userPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTeam {
  name: string;
  description?: string;
}

export interface ITeamMember {
  _id: string;
  userId: string;
  teamId: string;
  joinedAt: Date;
  role: TeamRoleEnum;
  status: MemberStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetUserTeams {
  _id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: Date;
  createdBy: string;
}

export interface ITeam {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ITeamMemberWithUser extends Omit<ITeamMember, 'userId'> {
  userId: Pick<IUser, '_id' | 'name' | 'email'>;
}

export interface ITeamWithDetails {
  team: ITeam;
  teamMember: ITeamMemberWithUser[];
}

export interface IInviteTeamMember {
  inviteeEmail: string;
  role: InviteTeamRoleEnum;
  teamId: string;
}

export interface IChangeTeamMemberRole {
  id: string;
  role: string;
}

export interface ICreateProject {
  name: string;
  description?: string;
  databaseType: ProjectDataBaseTypeEnum;
  teamIds: string[];
  connectionString?: string;
  tag: string[];
}

export interface IProject {
  name: string;
  description: string;
  teamIds: string[];
  databaseType: ProjectDataBaseTypeEnum;
  tag: string[];
  connectionString: string;
  createdBy: string;
  inviteToken: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectMember {
  _id: string | unknown;
  userId: string;
  projectId: string;
  role: ProjectMemberRoleEnum;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
