export interface ILogin {
  email: string;
  password: string;
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
  data: {
    secret: string;
    qrImageUrl: string;
    message: string;
  };
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

export interface IGetAllSessionsRes {
  data: {
    message: string;
    sessions: ISession[];
  };
}
