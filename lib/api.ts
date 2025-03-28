import {
  APIResponse,
  ICreateTeam,
  ILogin,
  ILoginResponse,
  IRegister,
  IResetPassword,
  ISession,
  ISetUpMfaRes,
  ITeam,
  ITeamWithDetails,
  IUser,
  IVerifyMfa,
  IVerifyMfaAndLogin
} from '@/definitions/interface';

import API from './axios-client';

// <-------- AUTHENTICATION MUTATIONS -------->
export const LoginMutationFn = async (
  data: ILogin
): Promise<APIResponse<ILoginResponse>> => await API.post('/auth/login', data);

export const registerMutationFn = async (data: IRegister) =>
  await API.post('/auth/register', data);

export const ForgotPasswordSendEmailMutationFn = async (data: {
  email: string;
}) => await API.post('/auth/password/forgot', data);

export const ResetPasswordMutationFn = async (data: IResetPassword) =>
  await API.post('/auth/password/reset', data);

export const ConfirmAccountMutationFn = async (data: { code: string }) =>
  await API.post('/auth/verify/email', data);

export const LogoutMutationFn = async () => await API.post('/auth/logout');

// <-------- SESSION MUTATIONS -------->
export const getCurrentSessionMutationFn = async (): Promise<
  APIResponse<IUser>
> => await API.get('/session/current');

export const getAllSessionsMutationFn = async (): Promise<
  APIResponse<ISession[]>
> => await API.get('/session/all');

export const deleteSessionMutationFn = async (sessionId: string) =>
  await API.delete(`/session/${sessionId}`);

// <-------- MFA MUTATIONS -------->
export const setUpMfaMutationFn = async (): Promise<
  APIResponse<ISetUpMfaRes>
> => await API.get('/mfa/setup');

export const verifyMafMutationFn = async (data: IVerifyMfa) =>
  await API.post('/mfa/verify', data);

export const revokeMfaMutationFn = async () => await API.put('/mfa/revoke');

export const verifyMfaAndLoginMutationFn = async (data: IVerifyMfaAndLogin) =>
  await API.post('/mfa/verify-login', data);

// <-------- TEAM MUTATIONS -------->
export const createTeamMutationFn = async (
  data: ICreateTeam
): Promise<APIResponse<ITeam>> => await API.post('/team/create', data);

export const getAllUserTeamsMutationFn = async (): Promise<
  APIResponse<ITeam[]>
> => await API.get('/team/user-teams');

export const updateTeamDetailsMutationFn = async (
  data: ICreateTeam & { teamId: string }
) =>
  await API.put(`/team/update/${data?.teamId}`, {
    name: data.name,
    description: data.description
  });

export const deleteTeamMutationFn = async (teamId: string) =>
  await API.delete(`/team/delete/${teamId}`);

export const getTeamByIdMutationFn = async (
  teamId: string
): Promise<APIResponse<ITeamWithDetails>> => await API.get(`/team/${teamId}`);
