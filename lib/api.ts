import {
  APIResponse,
  IChangeTeamMemberRole,
  ICreateProject,
  ICreateTeam,
  IGetUserTeams,
  IInviteTeamMember,
  ILogin,
  ILoginResponse,
  IProject,
  IProjectMember,
  IRegister,
  IResetPassword,
  ISession,
  ISetUpMfaRes,
  ITeam,
  ITeamMember,
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

export const inviteTeamMemberMutationFn = async (
  data: IInviteTeamMember
): Promise<APIResponse<{ email: string; url: string }>> =>
  await API.post('/team/invite', data);

export const acceptTeamInvitationMutationFn = async (data: {
  token: string;
}): Promise<APIResponse<{ teamId: string }>> =>
  await API.post('/team/accept-invite', data);

export const getAllUserTeamsMutationFn = async (): Promise<
  APIResponse<IGetUserTeams[]>
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

export const leaveOrRemoveTeamMemberMutationFn = async (
  id: string
): Promise<APIResponse<{ isSelf: boolean }>> =>
  await API.delete(`/team/member/remove/${id}`);

export const changeTeamMemberRoleMutationFn = async (
  data: IChangeTeamMemberRole
): Promise<APIResponse<ITeamMember>> =>
  await API.put('team/member/change-role', data);

export const getUserCreatedTeamsMutationFn = async (): Promise<
  APIResponse<ITeam[]>
> => await API.get('/team/user-created-teams');

// <-------- PROJECT MUTATIONS -------->
export const createProjectMutationFn = async (
  data: ICreateProject
): Promise<APIResponse<IProject>> => await API.post('/project/create', data);

export const getProjectsMutationFn = async (): Promise<
  APIResponse<IProject[]>
> => await API.get('/project');

export const updateProjectMutationFn = async (
  data: Partial<ICreateProject> & { projectId: string }
): Promise<APIResponse<IProject>> => {
  const { projectId, ...rest } = data;
  return await API.put(`/project/update/${projectId}`, rest);
};

export const deleteProjectMutationFn = async (projectId: string) =>
  await API.delete(`/project/delete/${projectId}`);

export const addTeamToProjectMutationFn = async (data: {
  projectId: string;
  teamIds: string[];
}): Promise<APIResponse<IProject>> => await API.put('/project/add-team', data);

export const removeTeamFromProjectMutationFn = async (data: {
  projectId: string;
  teamId: string;
}): Promise<APIResponse<IProject>> =>
  await API.put('/project/remove-team', data);

export const getProjectDetailsByIdMutationFn = async (
  id: string
): Promise<APIResponse<IProject>> => await API.get(`/project/${id}`);

export const getProjectAssociatedMembersMutationFn = async (
  projectId: string
): Promise<APIResponse<{ project: IProject; members: string[] }>> =>
  await API.get(`/project/members/${projectId}`);

export const acceptProjectInvitationMutationFn = async (
  token: string
): Promise<APIResponse<IProjectMember>> =>
  await API.post('/project/accept-invite', { token });

export const inviteProjectMemberMutationFn = async (data: {
  emails: string[];
  projectId: string;
}) => await API.post('/project/invite', data);
