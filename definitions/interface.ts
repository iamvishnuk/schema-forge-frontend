import { InviteTeamRoleEnum, MemberStatusEnum, TeamRoleEnum } from './enums';

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
  joinedAt: Date;
  role: TeamRoleEnum;
  status: MemberStatusEnum;
}
export interface ITeam {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  members: ITeamMember[];
  projects: string[];
}

export interface ITeamMemberWithUser extends Omit<ITeamMember, 'userId'> {
  userId: Pick<IUser, '_id' | 'name' | 'email'>;
}

export interface ITeamWithDetails extends Omit<ITeam, 'createdBy' | 'members'> {
  createdBy: Pick<IUser, '_id' | 'name' | 'email'>;
  members: ITeamMemberWithUser[];
}

export interface IInviteTeamMember {
  inviteeEmail: string;
  role: InviteTeamRoleEnum;
  teamId: string;
}
