import { ProjectMemberRoleEnum } from '@/definitions/enums';

export const TEAM_ROLES = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' }
];

export const TEAM_MEMBER_STATUS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'invited', label: 'Invited' },
  { value: 'suspended', label: 'Suspended' }
];

export const PROJECT_MEMBER_ROLES: {
  value: ProjectMemberRoleEnum;
  label: string;
}[] = [
  { value: ProjectMemberRoleEnum.OWNER, label: 'Owner' },
  { value: ProjectMemberRoleEnum.EDITOR, label: 'Editor' },
  { value: ProjectMemberRoleEnum.VIEWER, label: 'Viewer' }
];
