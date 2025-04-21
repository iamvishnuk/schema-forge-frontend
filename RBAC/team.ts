import { TeamRoleEnum } from '@/definitions/enums';

export interface Permission {
  id: string;
  description: string;
}

// Define permission mappings
export const TEAM_ROLE_PERMISSIONS = {
  [TeamRoleEnum.OWNER]: [
    'team:view',
    'team:invite',
    'team:update',
    'team:delete',
    'team:change_member_roles',
    'team:remove_member',
    'team:manage_settings'
  ],
  [TeamRoleEnum.ADMIN]: [
    'team:view',
    'team:invite',
    'team:update',
    'team:change_member_roles',
    'team:remove_member'
  ],
  [TeamRoleEnum.EDITOR]: ['team:view'],
  [TeamRoleEnum.VIEWER]: ['team:view']
} as const;

// Extract the permission type from the const assertion object
export type PermissionType =
  (typeof TEAM_ROLE_PERMISSIONS)[TeamRoleEnum][number];

// Type the function with the extracted permission type
export function checkTeamRolePermission(
  role: TeamRoleEnum | undefined,
  permission: PermissionType
): boolean {
  if (!role || !permission) {
    return false;
  }

  // Need to cast here because of the "as const" assertion
  const permissions = TEAM_ROLE_PERMISSIONS[role];
  if (!permissions) {
    return false;
  }

  return (permissions as readonly string[]).includes(permission);
}
