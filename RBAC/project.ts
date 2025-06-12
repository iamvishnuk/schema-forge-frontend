import { ProjectMemberRoleEnum } from '@/definitions/enums';

export const PROJECT_ROLE_PERMISSIONS = {
  [ProjectMemberRoleEnum.OWNER]: [
    'project:design:view',
    'project:design:edit',
    'project:design:delete',
    'project:collections:view',
    'project:collections:edit',
    'project:collections:delete',
    'project:settings:view',
    'project:settings:edit',
    'project:settings:delete',
    'project:member:view',
    'project:member:edit',
    'project:member:delete'
  ],
  [ProjectMemberRoleEnum.EDITOR]: [
    'project:design:view',
    'project:design:edit',
    'project:design:delete',
    'project:collections:view',
    'project:collections:edit',
    'project:collections:delete'
  ],
  [ProjectMemberRoleEnum.VIEWER]: [
    'project:design:view',
    'project:collections:view'
  ]
} as const;

export type ProjectPermissionType =
  (typeof PROJECT_ROLE_PERMISSIONS)[ProjectMemberRoleEnum][number];

export function checkProjectRolePermission(
  role: ProjectMemberRoleEnum | undefined,
  permission: ProjectPermissionType
): boolean {
  if (!role || !permission) {
    return false;
  }

  const permissions = PROJECT_ROLE_PERMISSIONS[role];
  if (!permissions) {
    return false;
  }

  return (permissions as readonly string[]).includes(permission);
}
