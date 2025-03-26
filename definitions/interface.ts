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
